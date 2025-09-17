import React, { useState, useEffect, Suspense, lazy } from "react";
import { motion } from "framer-motion";
import type { Mission, GameState } from "../types";
import { apiService } from "../services/api";
import { telegramService } from "../utils/telegram";

// Lazy load LazyImage for optimization
const LazyImage = lazy(() => import("./LazyImage"));

interface MissionPanelProps {
  gameState: GameState;
  onGameStateChange: (gameState: GameState) => void;
}

const MissionPanel: React.FC<MissionPanelProps> = ({
  gameState,
  onGameStateChange,
}) => {
  const [missions, setMissions] = useState<Mission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadMissions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update missions when game state changes
  useEffect(() => {
    if (missions.length > 0) {
      const updatedMissions = updateMissionProgress(missions);
      setMissions(updatedMissions);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    gameState.dailyTapsCount,
    gameState.hasCustomizedToday,
    gameState.rewardedMissions,
  ]);

  const loadMissions = async () => {
    try {
      setLoading(true);
      const fetchedMissions = await apiService.getMissions();
      const updatedMissions = updateMissionProgress(fetchedMissions);
      setMissions(updatedMissions);
      setError(null);
    } catch (error) {
      // This error is expected during development since we're using a placeholder API
      console.info("Using mock mission data (API endpoint not configured)");
      console.debug("API error:", error);
      setError(null); // Don't show error to user, just use mock data
      const mockMissions = await apiService.getMissions(); // This will return mock data
      const updatedMissions = updateMissionProgress(mockMissions);
      setMissions(updatedMissions);
    } finally {
      setLoading(false);
    }
  };

  const updateMissionProgress = (missions: Mission[]) => {
    return missions.map((mission) => {
      // Check if mission has been rewarded
      const rewarded = gameState.rewardedMissions.includes(mission.id);

      switch (mission.type) {
        case "tap_count": {
          const progress = Math.min(
            gameState.dailyTapsCount,
            mission.target || 0
          );
          const completed = progress >= (mission.target || 0);
          return { ...mission, progress, completed, rewarded };
        }

        case "customization": {
          return {
            ...mission,
            completed: gameState.hasCustomizedToday,
            rewarded,
          };
        }

        case "daily_login": {
          // Daily login is completed just by opening the app each day
          return { ...mission, completed: true, rewarded };
        }

        default:
          return { ...mission, rewarded };
      }
    });
  };

  const completeMission = (missionId: string) => {
    const mission = missions.find((m) => m.id === missionId);
    if (mission && mission.completed && !mission.rewarded) {
      // Mark mission as rewarded in local state
      setMissions((prev) =>
        prev.map((m) => (m.id === missionId ? { ...m, rewarded: true } : m))
      );

      // Add mission to rewarded missions list and update coins in game state
      const newGameState = {
        ...gameState,
        coins: gameState.coins + mission.reward,
        rewardedMissions: [...gameState.rewardedMissions, missionId],
      };
      onGameStateChange(newGameState);

      // Provide haptic and notification feedback
      telegramService.hapticFeedback("medium");
      telegramService.notificationFeedback("success");
    }
  };

  if (loading) {
    return (
      <div className="mission-panel">
        <h3>Daily Missions</h3>
        <div className="loading">Loading missions...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mission-panel">
        <h3>Daily Missions</h3>
        <div className="error">
          {error}
          <button onClick={loadMissions} className="retry-btn">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className="mission-panel"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}>
      <motion.h3
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}>
        🎯 Daily Missions
      </motion.h3>
      <div className="missions-list">
        {missions.map((mission, index) => (
          <motion.div
            key={mission.id}
            className={`mission-card ${mission.completed ? "completed" : ""}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 + index * 0.1, duration: 0.5 }}
            whileHover={{ scale: 1.02, y: -2 }}>
            {mission.imageUrl && (
              <div className="mission-image">
                <Suspense
                  fallback={<div className="image-placeholder">🖼️</div>}>
                  <LazyImage
                    src={mission.imageUrl}
                    alt={mission.title}
                    className="mission-img"
                  />
                </Suspense>
              </div>
            )}
            <div className="mission-info">
              <h4>{mission.title}</h4>
              <p>{mission.description}</p>

              {/* Show progress for tap count missions */}
              {mission.type === "tap_count" && mission.target && (
                <div className="mission-progress">
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{
                        width: `${Math.min(
                          ((mission.progress || 0) / mission.target) * 100,
                          100
                        )}%`,
                      }}></div>
                  </div>
                  <span className="progress-text">
                    {mission.progress || 0} / {mission.target}
                  </span>
                </div>
              )}

              <div className="mission-reward">
                <span className="reward-amount">+{mission.reward} coins</span>
                {!mission.completed && (
                  <span className="incomplete-badge">Not completed</span>
                )}
                {mission.completed && !mission.rewarded && (
                  <motion.button
                    className="complete-btn"
                    onClick={() => completeMission(mission.id)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}>
                    🎁 Claim Reward
                  </motion.button>
                )}
                {mission.completed && mission.rewarded && (
                  <span className="completed-badge">✓ Claimed</span>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default MissionPanel;
