import type { CustomizationOption } from "../types";

// API Configuration
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || "https://api.example.com",
  ENDPOINTS: {
    GET_MISSIONS: "/getMissions",
    GET_TAPS: "/getTaps",
  },
  TIMEOUT: 2000,
} as const;

// Game Configuration
export const GAME_CONFIG = {
  COINS_PER_TAP: 1,
  DAILY_TAP_LIMIT: 200, // 200 $DOGG daily limit as per requirements
  MILESTONE_TAPS: 50, // Haptic feedback every 50 taps
  PROGRESS_BAR_INTERVAL: 10, // Progress bar updates every 10 taps
} as const;

// Animation Configuration
export const ANIMATION_CONFIG = {
  FRAME_DURATION: 500, // 0.5 second transition as per requirements
  TAP_EFFECT_DURATION: 200, // Duration for tap effect animation in ms
} as const;

// UI Configuration
export const UI_CONFIG = {
  COLORS: {
    TELEGRAM_HEADER: "#4CAF50", // Green header color for Telegram
  },
} as const;

// Storage Keys
export const STORAGE_KEYS = {
  GAME_STATE: "dogGameState",
} as const;

// Dog Customization Options
export const DOG_OPTIONS = {
  COLORS: {
    brown: "#D4A574",
    golden: "#FFD700",
    black: "#2C2C2C",
    white: "#F5F5F5",
    gray: "#808080",
    cream: "#F5F5DC",
  },
  BODY_TYPES: {
    default: {
      name: "Default",
      emoji: "🐕",
    },
    fluffy: {
      name: "Fluffy",
      emoji: "🐩",
    },
    slim: {
      name: "Slim",
      emoji: "🐺",
    },
  },
  HATS: {
    none: "",
    cap: "🧢",
    crown: "👑",
    bow: "🎀",
    headband: "🎯",
    santa: "🎅",
  },
} as const;

// SVG Constants
export const SVG_CONSTANTS = {
  // SVG dimensions
  WIDTH: 120,
  HEIGHT: 120,
  VIEWBOX: "0 0 120 120",

  // Body positions and sizes
  BODY: {
    DEFAULT: { cx: 60, cy: 70, rx: 25, ry: 30 },
    FLUFFY: { cx: 60, cy: 70, rx: 30, ry: 35 },
    SLIM: { cx: 60, cy: 70, rx: 20, ry: 28 },
  },

  // Head positions and sizes
  HEAD: {
    DEFAULT: { cx: 60, cy: 35, r: 20 },
    FLUFFY: { cx: 60, cy: 35, r: 24 },
    SLIM: { cx: 60, cy: 35, rx: 18, ry: 20 },
  },

  // Ear positions and sizes
  EARS: {
    DEFAULT: {
      LEFT: { cx: 45, cy: 25, rx: 8, ry: 12 },
      RIGHT: { cx: 75, cy: 25, rx: 8, ry: 12 },
    },
    FLUFFY: {
      LEFT: { cx: 43, cy: 23, rx: 10, ry: 15 },
      RIGHT: { cx: 77, cy: 23, rx: 10, ry: 15 },
    },
    SLIM: {
      LEFT: { cx: 47, cy: 22, rx: 6, ry: 14 },
      RIGHT: { cx: 73, cy: 22, rx: 6, ry: 14 },
    },
  },

  // Eye positions
  EYES: {
    DEFAULT: {
      LEFT: { cx: 52, cy: 30, r: 3 },
      RIGHT: { cx: 68, cy: 30, r: 3 },
      LEFT_HIGHLIGHT: { cx: 53, cy: 29, r: 1 },
      RIGHT_HIGHLIGHT: { cx: 69, cy: 29, r: 1 },
    },
    SLIM: {
      LEFT: { cx: 54, cy: 30, r: 3 },
      RIGHT: { cx: 66, cy: 30, r: 3 },
      LEFT_HIGHLIGHT: { cx: 55, cy: 29, r: 1 },
      RIGHT_HIGHLIGHT: { cx: 67, cy: 29, r: 1 },
    },
  },

  // Nose and mouth
  NOSE: { cx: 60, cy: 40, rx: 2, ry: 1.5 },

  // Leg positions
  LEGS: {
    DEFAULT: [
      { cx: 45, cy: 95, rx: 4, ry: 8 },
      { cx: 55, cy: 95, rx: 4, ry: 8 },
      { cx: 65, cy: 95, rx: 4, ry: 8 },
      { cx: 75, cy: 95, rx: 4, ry: 8 },
    ],
    FLUFFY: [
      { cx: 45, cy: 95, rx: 5, ry: 10 },
      { cx: 55, cy: 95, rx: 5, ry: 10 },
      { cx: 65, cy: 95, rx: 5, ry: 10 },
      { cx: 75, cy: 95, rx: 5, ry: 10 },
    ],
    SLIM: [
      { cx: 47, cy: 95, rx: 3, ry: 9 },
      { cx: 56, cy: 95, rx: 3, ry: 9 },
      { cx: 64, cy: 95, rx: 3, ry: 9 },
      { cx: 73, cy: 95, rx: 3, ry: 9 },
    ],
  },

  // Colors
  COLORS: {
    STROKE: "#333",
    WHITE: "#fff",
    TONGUE: "#ff69b4",
  },

  // Stroke widths
  STROKE_WIDTH: {
    BODY: 2,
    EARS: 1.5,
    LEGS: 1.5,
    MOUTH: 1.5,
    TAIL_DEFAULT: 6,
    TAIL_FLUFFY: 8,
    TAIL_SLIM: 5,
  },

  // Animation transforms
  TRANSFORMS: {
    FRAME2: "translate(0, -5)",
    FRAME3: "translate(0, -10)",
  },

  // Fluffy texture circles
  FLUFFY_TEXTURE: {
    BODY: [
      { cx: 45, cy: 60, r: 4, opacity: 0.7 },
      { cx: 75, cy: 65, r: 3, opacity: 0.7 },
      { cx: 50, cy: 80, r: 3, opacity: 0.7 },
      { cx: 70, cy: 85, r: 4, opacity: 0.7 },
    ],
    HEAD: [
      { cx: 45, cy: 30, r: 3, opacity: 0.6 },
      { cx: 75, cy: 32, r: 2, opacity: 0.6 },
      { cx: 60, cy: 20, r: 2, opacity: 0.6 },
    ],
  },
} as const;

// Customization Options Configuration
export const CUSTOMIZATION_OPTIONS: CustomizationOption[] = [
  // Body options
  {
    id: "default",
    name: DOG_OPTIONS.BODY_TYPES.default.name,
    preview: DOG_OPTIONS.BODY_TYPES.default.emoji,
    category: "body",
  },
  {
    id: "fluffy",
    name: DOG_OPTIONS.BODY_TYPES.fluffy.name,
    preview: DOG_OPTIONS.BODY_TYPES.fluffy.emoji,
    category: "body",
  },
  {
    id: "slim",
    name: DOG_OPTIONS.BODY_TYPES.slim.name,
    preview: DOG_OPTIONS.BODY_TYPES.slim.emoji,
    category: "body",
  },

  // Hat options
  { id: "none", name: "No Hat", preview: "⭕", category: "hat" },
  { id: "cap", name: "Cap", preview: "🧢", category: "hat" },
  { id: "crown", name: "Crown", preview: "👑", category: "hat" },
  { id: "bow", name: "Bow", preview: "🎀", category: "hat" },
  { id: "headband", name: "Headband", preview: "🎯", category: "hat" },
  { id: "santa", name: "Santa Hat", preview: "🎅", category: "hat" },

  // Color options
  { id: "brown", name: "Brown", preview: "🤎", category: "color" },
  { id: "golden", name: "Golden", preview: "🟡", category: "color" },
  { id: "black", name: "Black", preview: "⚫", category: "color" },
  { id: "white", name: "White", preview: "⚪", category: "color" },
  { id: "gray", name: "Gray", preview: "🩶", category: "color" },
  { id: "cream", name: "Cream", preview: "🟤", category: "color" },
] as const;

// Calculate actual number of possible combinations
export const TOTAL_COMBINATIONS =
  CUSTOMIZATION_OPTIONS.filter((opt) => opt.category === "body").length *
  CUSTOMIZATION_OPTIONS.filter((opt) => opt.category === "hat").length *
  CUSTOMIZATION_OPTIONS.filter((opt) => opt.category === "color").length;
