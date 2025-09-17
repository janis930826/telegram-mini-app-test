export interface Mission {
  id: string;
  title: string;
  description: string;
  reward: number;
  completed: boolean;
  imageUrl?: string;
  type: "tap_count" | "customization" | "daily_login" | "manual";
  target?: number; // For missions like "tap 100 times"
  progress?: number; // Current progress towards target
  rewarded?: boolean; // Has the user claimed the reward
}

export interface DogCustomization {
  body: "default" | "fluffy" | "slim";
  hat: "none" | "cap" | "crown" | "bow" | "headband" | "santa";
  color: "brown" | "golden" | "black" | "white" | "gray" | "cream";
}

export interface GameState {
  coins: number;
  tapsCount: number;
  dogCustomization: DogCustomization;
  dailyTapsCount: number; // Taps today
  hasCustomizedToday: boolean; // Has customized dog today
  lastLoginDate: string; // Last login date for daily missions
  rewardedMissions: string[]; // IDs of missions that have been rewarded today
}

export interface CustomizationOption {
  id: string;
  name: string;
  preview: string;
  category: "body" | "hat" | "color";
}
