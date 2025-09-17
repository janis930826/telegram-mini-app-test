import type { Mission } from "../types";
import { API_CONFIG } from "../utils/constants";

export const apiService = {
  async getMissions(): Promise<Mission[]> {
    try {
      // Actual API call to /getMissions endpoint
      const response = await fetch(
        `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.GET_MISSIONS}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            // Add any required authentication headers here
            // "Authorization": `Bearer ${token}`,
          },
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

      // Return mock data for development - missions with 300x100px images
      return [
        {
          id: "daily_login_001",
          title: "Daily Login Bonus",
          description: "Login to the app daily to earn bonus coins",
          reward: 100,
          completed: false,
          imageUrl: "https://picsum.photos/300/100?random=1&t=daily",
          type: "daily_login" as const,
        },
        {
          id: "tap_challenge_001",
          title: "Tap Master Challenge",
          description: "Tap your dog 100 times today to become a tap master",
          reward: 50,
          completed: false,
          imageUrl: "https://picsum.photos/300/100?random=2&t=tap",
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
          imageUrl: "https://picsum.photos/300/100?random=3&t=tap",
          type: "customization" as const,
        },
      ];
    }
  },
};
