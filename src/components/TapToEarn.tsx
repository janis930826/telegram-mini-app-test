import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import CanvasDogAnimation from "./CanvasDogAnimation";
import MissionPanel from "./MissionPanel";
import type { GameState } from "../types";
import { telegramService } from "../utils/telegram";
import { GAME_CONFIG } from "../utils/constants";
import { apiService } from "../services/api";

interface TapToEarnProps {
  gameState: GameState;
  onGameStateChange: (gameState: GameState) => void;
}

const TapToEarn: React.FC<TapToEarnProps> = ({
  gameState,
  onGameStateChange,
}) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [coinAnimation, setCoinAnimation] = useState(false);
  const [canTap, setCanTap] = useState(true);
  const [tapStatusLoading, setTapStatusLoading] = useState(false);

  // Check daily tap limit
  const dailyTapsRemaining = Math.max(
    0,
    GAME_CONFIG.DAILY_TAP_LIMIT - gameState.dailyTapsCount
  );
  const progressBarValue =
    (gameState.dailyTapsCount % GAME_CONFIG.PROGRESS_BAR_INTERVAL) /
    GAME_CONFIG.PROGRESS_BAR_INTERVAL;

  // Load tap status from backend on component mount (only if we don't have local data)
  useEffect(() => {
    const loadTapStatus = async () => {
      setTapStatusLoading(true);
      try {
        const tapStatus = await apiService.getTaps();

        // Only update game state with backend data if:
        // 1. We have meaningful backend data (not just mock zeros)
        // 2. Backend data is more recent than local data
        const hasBackendData =
          tapStatus.dailyTapsCount > 0 ||
          tapStatus.totalTapsCount > 0 ||
          tapStatus.coinsEarned > 0;
        const hasLocalData =
          gameState.dailyTapsCount > 0 ||
          gameState.tapsCount > 0 ||
          gameState.coins > 0;

        if (
          hasBackendData &&
          (!hasLocalData || tapStatus.totalTapsCount > gameState.tapsCount)
        ) {
          console.info("Updating game state with backend data");
          onGameStateChange({
            ...gameState,
            dailyTapsCount: tapStatus.dailyTapsCount,
            tapsCount: tapStatus.totalTapsCount || gameState.tapsCount,
            coins: tapStatus.coinsEarned || gameState.coins,
          });
        } else {
          console.info(
            "Keeping local game state (backend data is empty or outdated)"
          );
        }

        setCanTap(tapStatus.canTap && dailyTapsRemaining > 0);
      } catch (error) {
        console.error("Failed to load tap status:", error);
        setCanTap(dailyTapsRemaining > 0);
      } finally {
        setTapStatusLoading(false);
      }
    };

    // Only load from backend on first app initialization, not on page switches
    const hasInitialData =
      gameState.dailyTapsCount > 0 || gameState.tapsCount > 0;
    if (!hasInitialData) {
      loadTapStatus();
    } else {
      // Just update the canTap status based on existing data
      setCanTap(dailyTapsRemaining > 0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array is intentional for mount-only effect

  // Update canTap when daily taps change
  useEffect(() => {
    setCanTap(dailyTapsRemaining > 0);
  }, [dailyTapsRemaining]);

  const handleTap = () => {
    // Check if tapping is allowed
    if (!canTap || gameState.dailyTapsCount >= GAME_CONFIG.DAILY_TAP_LIMIT) {
      telegramService.hapticFeedback("heavy");
      telegramService.notificationFeedback("error");
      return;
    }

    setIsAnimating(true);
    setCoinAnimation(true);

    // Fixed coins per tap
    const coinsEarned = GAME_CONFIG.COINS_PER_TAP;

    const newGameState = {
      ...gameState,
      coins: gameState.coins + coinsEarned,
      tapsCount: gameState.tapsCount + 1,
      dailyTapsCount: gameState.dailyTapsCount + 1,
    };
    onGameStateChange(newGameState);

    // Reset animations
    setTimeout(() => {
      setIsAnimating(false);
      setCoinAnimation(false);
    }, 1000);

    // Notification feedback for milestone taps
    if ((gameState.tapsCount + 1) % GAME_CONFIG.MILESTONE_TAPS === 0) {
      telegramService.notificationFeedback("success");
    }

    // Progress bar haptic feedback every 10 taps
    if (
      (gameState.dailyTapsCount + 1) % GAME_CONFIG.PROGRESS_BAR_INTERVAL ===
      0
    ) {
      telegramService.hapticFeedback("medium");
    }

    // Update canTap status
    setCanTap(newGameState.dailyTapsCount < GAME_CONFIG.DAILY_TAP_LIMIT);
  };

  return (
    <div className="tap-to-earn">
      <div className="game-header">
        <div className="stats-container">
          <motion.div
            className="stat-item"
            animate={coinAnimation ? { scale: [1, 1.1, 1] } : {}}
            transition={{ duration: 0.3 }}>
            <span className="stat-label">💰 Coins ($DOGG)</span>
            <span
              className={`stat-value ${coinAnimation ? "coin-bounce" : ""}`}>
              {gameState.coins.toLocaleString()}
            </span>
          </motion.div>
          <div className="stat-item">
            <span className="stat-label">Daily Taps</span>
            <span className={`stat-value ${!canTap ? "limit-reached" : ""}`}>
              {gameState.dailyTapsCount}/{GAME_CONFIG.DAILY_TAP_LIMIT}
            </span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Total Taps</span>
            <span className="stat-value">
              {gameState.tapsCount.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="progress-container">
          <div className="progress-label">
            Progress to next milestone ({GAME_CONFIG.PROGRESS_BAR_INTERVAL}{" "}
            taps)
          </div>
          <div className="progress-bar">
            <motion.div
              className="progress-fill"
              initial={{ width: 0 }}
              animate={{ width: `${progressBarValue * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
          <div className="progress-text">
            {gameState.dailyTapsCount % GAME_CONFIG.PROGRESS_BAR_INTERVAL}/
            {GAME_CONFIG.PROGRESS_BAR_INTERVAL}
          </div>
        </div>

        {/* Daily Limit Warning */}
        {!canTap && (
          <motion.div
            className="daily-limit-warning"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}>
            🚫 Daily limit reached! ({GAME_CONFIG.DAILY_TAP_LIMIT} $DOGG)
            <br />
            <small>Come back tomorrow for more taps!</small>
          </motion.div>
        )}

        {tapStatusLoading && (
          <div className="loading-indicator">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
              ⏳
            </motion.div>
            Loading tap status...
          </div>
        )}
      </div>

      <div className="game-content">
        <motion.div
          whileTap={canTap ? { scale: 0.95 } : {}}
          transition={{ duration: 0.1 }}>
          <CanvasDogAnimation
            onTap={handleTap}
            isAnimating={isAnimating}
            customization={gameState.dogCustomization}
          />
        </motion.div>

        <div className="tap-instruction">
          {canTap ? (
            <>
              <motion.p
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}>
                🐕 Tap your dog to earn $DOGG!
              </motion.p>
              <p className="earn-info">
                +{GAME_CONFIG.COINS_PER_TAP} $DOGG per tap
              </p>
              <p className="remaining-info">
                {dailyTapsRemaining} taps remaining today
              </p>
            </>
          ) : (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="limit-reached-message">
              🛑 Daily limit reached!
            </motion.p>
          )}
        </div>
      </div>

      <MissionPanel
        gameState={gameState}
        onGameStateChange={onGameStateChange}
      />
    </div>
  );
};

export default TapToEarn;
