import { useState, useEffect } from "react";
import TapToEarn from "./components/TapToEarn";
import DogCustomization from "./components/DogCustomization";
import Navigation from "./components/Navigation";
import ErrorBoundary from "./components/ErrorBoundary";
import type {
  GameState,
  DogCustomization as DogCustomizationType,
} from "./types";
import { telegramService } from "./utils/telegram";
import { STORAGE_KEYS, UI_CONFIG } from "./utils/constants";
import { performanceMonitor, usePerformanceMonitor } from "./utils/performance";
import "./App.css";

function App() {
  // Performance monitoring for the main App component
  usePerformanceMonitor("App");

  const [currentPage, setCurrentPage] = useState<"tap" | "customize">("tap");
  const [gameState, setGameState] = useState<GameState>({
    coins: 0,
    tapsCount: 0,
    dogCustomization: {
      body: "default",
      hat: "none",
      color: "brown",
    },
    dailyTapsCount: 0,
    hasCustomizedToday: false,
    lastLoginDate: new Date().toDateString(),
    rewardedMissions: [],
  });

  useEffect(() => {
    // Start performance monitoring for app initialization
    performanceMonitor.markStart("app-init");

    // Load saved game state from localStorage
    const savedState = localStorage.getItem(STORAGE_KEYS.GAME_STATE);
    if (savedState) {
      const loadedState = JSON.parse(savedState);
      const today = new Date().toDateString();

      // Reset daily progress if it's a new day
      if (loadedState.lastLoginDate !== today) {
        setGameState({
          ...loadedState,
          dailyTapsCount: 0,
          hasCustomizedToday: false,
          lastLoginDate: today,
          rewardedMissions: [], // Reset rewarded missions for new day
        });
      } else {
        setGameState(loadedState);
      }
    }

    // Initialize Telegram WebApp with version compatibility checks
    console.info(`Telegram WebApp version: ${telegramService.getVersion()}`);

    // Validate user authentication
    if (telegramService.isValidUser()) {
      console.info("User authenticated successfully");
    } else {
      console.warn("User authentication failed - running in development mode");
    }

    if (telegramService.isSupported("expand")) {
      telegramService.expandApp();
    } else {
      console.info("App expansion not supported in this Telegram version");
    }

    if (telegramService.isSupported("headerColor")) {
      telegramService.setHeaderColor(UI_CONFIG.COLORS.TELEGRAM_HEADER);
    } else {
      console.info(
        "Header color customization not supported in this Telegram version"
      );
    }

    // End performance monitoring
    const initTime = performanceMonitor.markEnd("app-init");
    console.info(`App initialization took ${initTime.toFixed(2)}ms`);

    // Report performance metrics after a short delay
    setTimeout(() => {
      const metrics = performanceMonitor.reportVitals();
      if (metrics && process.env.NODE_ENV === "development") {
        console.info("Performance metrics:", metrics);
      }
    }, 1000);
  }, []);

  useEffect(() => {
    // Save game state to localStorage whenever it changes
    localStorage.setItem(STORAGE_KEYS.GAME_STATE, JSON.stringify(gameState));
  }, [gameState]);

  const handleCustomizationChange = (
    newCustomization: DogCustomizationType
  ) => {
    setGameState((prev) => ({
      ...prev,
      dogCustomization: newCustomization,
      hasCustomizedToday: true, // Mark as customized today
    }));
  };

  return (
    <ErrorBoundary>
      <div className="app">
        <div className="app-container">
          {currentPage === "tap" && (
            <ErrorBoundary
              fallback={
                <div className="error-fallback">
                  Failed to load Tap-to-Earn game
                </div>
              }>
              <TapToEarn
                gameState={gameState}
                onGameStateChange={setGameState}
              />
            </ErrorBoundary>
          )}
          {currentPage === "customize" && (
            <ErrorBoundary
              fallback={
                <div className="error-fallback">
                  Failed to load Dog Customization
                </div>
              }>
              <DogCustomization
                customization={gameState.dogCustomization}
                onCustomizationChange={handleCustomizationChange}
              />
            </ErrorBoundary>
          )}
        </div>

        <Navigation currentPage={currentPage} onPageChange={setCurrentPage} />
      </div>
    </ErrorBoundary>
  );
}

export default App;
