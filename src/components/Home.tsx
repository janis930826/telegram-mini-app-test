import React from "react";
import { motion } from "framer-motion";
import type { GameState } from "../types";
import DogSvg from "./DogSvg";
import { GAME_CONFIG } from "../utils/constants";

interface HomeProps {
  gameState: GameState;
  onPageChange: (page: "tap" | "customize" | "home") => void;
}

const Home: React.FC<HomeProps> = ({ gameState, onPageChange }) => {
  const progressPercentage = Math.min(
    (gameState.dailyTapsCount / GAME_CONFIG.DAILY_TAP_LIMIT) * 100,
    100
  );

  const stats = [
    {
      label: "Total Coins",
      value: gameState.coins.toLocaleString(),
      icon: "💰",
      color: "#FFD700",
    },
    {
      label: "Total Taps",
      value: gameState.tapsCount.toLocaleString(),
      icon: "👆",
      color: "#4CAF50",
    },
    {
      label: "Today's Taps",
      value: `${gameState.dailyTapsCount}/${GAME_CONFIG.DAILY_TAP_LIMIT}`,
      icon: "🎯",
      color: "#2196F3",
    },
  ];

  const quickActions = [
    {
      title: "Tap to Earn",
      description: "Tap your dog and earn coins!",
      icon: "🎮",
      color: "#4CAF50",
      action: () => onPageChange("tap"),
      disabled: gameState.dailyTapsCount >= GAME_CONFIG.DAILY_TAP_LIMIT,
    },
    {
      title: "Customize Dog",
      description: "Dress up your virtual companion",
      icon: "🎨",
      color: "#FF9800",
      action: () => onPageChange("customize"),
      disabled: false,
    },
  ];

  return (
    <motion.div
      className="home-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}>
      {/* Header Section */}
      <motion.div
        className="home-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}>
        <h1>🐕 Welcome to Dog Tap!</h1>
        <p>Your virtual companion awaits</p>
      </motion.div>

      {/* Dog Preview Section */}
      <motion.div
        className="dog-preview-section"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}>
        <div className="dog-preview-card">
          <h3>Your Dog</h3>
          <div className="dog-display">
            <DogSvg
              bodyType={gameState.dogCustomization.body}
              frame={1}
              color={gameState.dogCustomization.color}
            />
            {gameState.dogCustomization.hat !== "none" && (
              <div className="dog-hat-home">
                {gameState.dogCustomization.hat === "cap" && "🧢"}
                {gameState.dogCustomization.hat === "crown" && "👑"}
                {gameState.dogCustomization.hat === "bow" && "🎀"}
                {gameState.dogCustomization.hat === "headband" && "🎯"}
                {gameState.dogCustomization.hat === "santa" && "🎅"}
              </div>
            )}
          </div>
          <div className="dog-info">
            <div className="dog-details">
              <span className="dog-trait">
                🐕 {gameState.dogCustomization.body}
              </span>
              <span className="dog-trait">
                🎨 {gameState.dogCustomization.color}
              </span>
              {gameState.dogCustomization.hat !== "none" && (
                <span className="dog-trait">
                  👒 {gameState.dogCustomization.hat}
                </span>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Section */}
      <motion.div
        className="stats-section"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}>
        <h2>📊 Your Stats</h2>
        <div className="stats-grid">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              className="stat-card"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + index * 0.1, duration: 0.5 }}
              whileHover={{ scale: 1.05, y: -5 }}>
              <div className="stat-icon" style={{ color: stat.color }}>
                {stat.icon}
              </div>
              <div className="stat-info">
                <div className="stat-value">{stat.value}</div>
                <div className="stat-label">{stat.label}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Daily Progress Section */}
      <motion.div
        className="progress-section"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}>
        <h3>🎯 Daily Progress</h3>
        <div className="progress-card">
          <div className="progress-header">
            <span>Today's Taps</span>
            <span>
              {gameState.dailyTapsCount}/{GAME_CONFIG.DAILY_TAP_LIMIT}
            </span>
          </div>
          <div className="progress-bar-container">
            <motion.div
              className="progress-bar-fill"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ delay: 0.6, duration: 1, ease: "easeOut" }}
              style={{
                background:
                  progressPercentage === 100
                    ? "linear-gradient(90deg, #4CAF50, #8BC34A)"
                    : "linear-gradient(90deg, #2196F3, #64B5F6)",
              }}
            />
          </div>
          {progressPercentage === 100 && (
            <motion.div
              className="progress-complete"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8, duration: 0.5 }}>
              ✨ Daily limit reached! Come back tomorrow!
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Quick Actions Section */}
      <motion.div
        className="quick-actions-section"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}>
        <h2>🚀 Quick Actions</h2>
        <div className="actions-grid">
          {quickActions.map((action, index) => (
            <motion.button
              key={action.title}
              className={`action-card ${action.disabled ? "disabled" : ""}`}
              onClick={action.action}
              disabled={action.disabled}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 + index * 0.1, duration: 0.5 }}
              whileHover={!action.disabled ? { scale: 1.05, y: -5 } : {}}
              whileTap={!action.disabled ? { scale: 0.95 } : {}}>
              <div className="action-icon" style={{ color: action.color }}>
                {action.icon}
              </div>
              <div className="action-info">
                <h3>{action.title}</h3>
                <p>{action.description}</p>
                {action.disabled && (
                  <span className="disabled-text">Daily limit reached</span>
                )}
              </div>
            </motion.button>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Home;
