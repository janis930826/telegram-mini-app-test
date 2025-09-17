import type { Mission } from "../types";
import { API_CONFIG, STORAGE_KEYS } from "../utils/constants";
import { telegramService } from "../utils/telegram";

export interface TapStatus {
  dailyTapsCount: number;
  totalTapsCount: number;
  coinsEarned: number;
  canTap: boolean;
  remainingTaps: number;
}

export const apiService = {
  // Helper method to get authenticated headers
  getAuthHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    // Add Telegram initData for authentication
    const initData = telegramService.getInitData();
    if (initData) {
      headers["X-Telegram-Init-Data"] = initData;
    }

    // Add user data for identification
    const userData = telegramService.getUserData();
    if (userData.id) {
      headers["X-Telegram-User-ID"] = userData.id.toString();
    }

    return headers;
  },

  async getMissions(): Promise<Mission[]> {
    try {
      // Validate user before making API calls
      if (!telegramService.isValidUser()) {
        console.warn("User validation failed, using mock data");
        return this.getMockMissions();
      }

      // Actual API call to /getMissions endpoint
      const response = await fetch(
        `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.GET_MISSIONS}`,
        {
          method: "GET",
          headers: this.getAuthHeaders(),
          signal: AbortSignal.timeout(API_CONFIG.TIMEOUT),
        }
      );

      if (!response.ok) {
        throw new Error(
          `Failed to fetch missions: ${response.status} ${response.statusText}`
        );
      }

      const missions = await response.json();

      // Validate that missions have the required structure
      if (!Array.isArray(missions)) {
        throw new Error("Invalid missions data format");
      }

      return missions;
    } catch (error) {
      console.error("Error fetching missions:", error);
      console.info("Using mock mission data for development");
      return this.getMockMissions();
    }
  },

  // Mock data for development and fallback
  getMockMissions(): Mission[] {
    return [
      {
        id: "daily_login_001",
        title: "Daily Login Bonus",
        description: "Login to the app daily to earn bonus coins",
        reward: 100,
        completed: false,
        imageUrl:
          "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f4b0.png",
        type: "daily_login" as const,
      },
      {
        id: "tap_challenge_001",
        title: "Tap Master Challenge",
        description: "Tap your dog 100 times today to become a tap master",
        reward: 50,
        completed: false,
        imageUrl:
          "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f415.png",
        type: "tap_count" as const,
        target: 100,
        progress: 0,
      },
      {
        id: "customization_001",
        title: "Style Your Companion",
        description: "Customize your dog's appearance with new styles",
        reward: 75,
        completed: false,
        imageUrl:
          "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f3a8.png",
        type: "customization" as const,
      },
    ];
  },

  async getTaps(): Promise<TapStatus> {
    try {
      // Validate user before making API calls
      if (!telegramService.isValidUser()) {
        console.warn("User validation failed, using mock data");
        return this.getMockTapStatus();
      }

      // Actual API call to /getTaps endpoint
      const response = await fetch(
        `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.GET_TAPS}`,
        {
          method: "GET",
          headers: this.getAuthHeaders(),
          signal: AbortSignal.timeout(API_CONFIG.TIMEOUT),
        }
      );

      if (!response.ok) {
        throw new Error(
          `Failed to fetch tap status: ${response.status} ${response.statusText}`
        );
      }

      const tapStatus = await response.json();

      // Validate that tap status has the required structure
      if (typeof tapStatus !== "object" || tapStatus === null) {
        throw new Error("Invalid tap status data format");
      }

      return tapStatus;
    } catch (error) {
      console.error("Error fetching tap status:", error);
      console.info("Using mock tap status data for development");
      return this.getMockTapStatus();
    }
  },

  // Mock tap status for development and fallback
  getMockTapStatus(): TapStatus {
    // Try to preserve existing data from localStorage if available
    const savedState = localStorage.getItem(STORAGE_KEYS.GAME_STATE);
    let existingData = null;

    if (savedState) {
      try {
        existingData = JSON.parse(savedState);
      } catch (error) {
        console.debug("Could not parse saved game state:", error);
      }
    }

    return {
      dailyTapsCount: existingData?.dailyTapsCount || 0,
      totalTapsCount: existingData?.tapsCount || 0,
      coinsEarned: existingData?.coins || 0,
      canTap: true,
      remainingTaps: Math.max(0, 200 - (existingData?.dailyTapsCount || 0)),
    };
  },
};
