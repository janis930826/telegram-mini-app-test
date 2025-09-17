import React, { useState } from "react";
import CanvasDogAnimation from "./CanvasDogAnimation";
import MissionPanel from "./MissionPanel";
import type { GameState } from "../types";
import { telegramService } from "../utils/telegram";
import { GAME_CONFIG } from "../utils/constants";

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

  const handleTap = () => {
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
  };

  return (
    <div className="tap-to-earn">
      <div className="game-header">
        <div className="stats-container">
          <div className="stat-item">
            <span className="stat-label">Coins</span>
            <span
              className={`stat-value ${coinAnimation ? "coin-bounce" : ""}`}>
              {gameState.coins.toLocaleString()}
            </span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Daily Taps</span>
            <span className="stat-value">{gameState.dailyTapsCount}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Taps</span>
            <span className="stat-value">
              {gameState.tapsCount.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      <div className="game-content">
        <CanvasDogAnimation
          onTap={handleTap}
          isAnimating={isAnimating}
          customization={gameState.dogCustomization}
        />

        <div className="tap-instruction">
          <p>Tap your dog to earn coins!</p>
          <p className="earn-info">+{GAME_CONFIG.COINS_PER_TAP} coin per tap</p>
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
