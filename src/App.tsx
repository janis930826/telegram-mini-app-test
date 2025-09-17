import { useState, useEffect } from "react";
import TapToEarn from "./components/TapToEarn";
import DogCustomization from "./components/DogCustomization";
import Navigation from "./components/Navigation";
import type {
  GameState,
  DogCustomization as DogCustomizationType,
} from "./types";
import { telegramService } from "./utils/telegram";
import { STORAGE_KEYS, UI_CONFIG } from "./utils/constants";
import "./App.css";

function App() {
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
    <div className="app">
      <div className="app-container">
        {currentPage === "tap" && (
          <TapToEarn gameState={gameState} onGameStateChange={setGameState} />
        )}
        {currentPage === "customize" && (
          <DogCustomization
            customization={gameState.dogCustomization}
            onCustomizationChange={handleCustomizationChange}
          />
        )}
      </div>

      <Navigation currentPage={currentPage} onPageChange={setCurrentPage} />
    </div>
  );
}

export default App;
