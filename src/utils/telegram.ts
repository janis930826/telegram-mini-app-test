import WebApp from "@twa-dev/sdk";

export class TelegramService {
  private static instance: TelegramService;

  private constructor() {
    // Initialize Telegram WebApp
    WebApp.ready();
  }

  public static getInstance(): TelegramService {
    if (!TelegramService.instance) {
      TelegramService.instance = new TelegramService();
    }
    return TelegramService.instance;
  }

  public hapticFeedback(type: "light" | "medium" | "heavy" = "medium"): void {
    try {
      if (this.isSupported("haptics")) {
        switch (type) {
          case "light":
            WebApp.HapticFeedback.impactOccurred("light");
            break;
          case "medium":
            WebApp.HapticFeedback.impactOccurred("medium");
            break;
          case "heavy":
            WebApp.HapticFeedback.impactOccurred("heavy");
            break;
        }
      }
    } catch (error) {
      // Silently handle haptic feedback errors as they're not critical
      console.debug("Haptic feedback not available:", error);
    }
  }

  public notificationFeedback(
    type: "error" | "success" | "warning" = "success"
  ): void {
    try {
      if (this.isSupported("haptics")) {
        WebApp.HapticFeedback.notificationOccurred(type);
      }
    } catch (error) {
      // Silently handle notification feedback errors as they're not critical
      console.debug("Notification feedback not available:", error);
    }
  }

  public expandApp(): void {
    try {
      if (WebApp.expand && typeof WebApp.expand === "function") {
        WebApp.expand();
      } else {
        console.info("App expansion not supported in this Telegram version");
      }
    } catch (error) {
      console.info("App expansion not available:", error);
    }
  }

  public getUserData() {
    return {
      id: WebApp.initDataUnsafe?.user?.id,
      firstName: WebApp.initDataUnsafe?.user?.first_name,
      lastName: WebApp.initDataUnsafe?.user?.last_name,
      username: WebApp.initDataUnsafe?.user?.username,
    };
  }

  public getInitData(): string {
    return WebApp.initData || "";
  }

  public validateInitData(): boolean {
    try {
      // Check if we have initData
      const initData = this.getInitData();
      if (!initData) {
        console.warn("No initData available - running in development mode");
        return false;
      }

      // Check if we have user data
      const userData = this.getUserData();
      if (!userData.id) {
        console.warn("No user ID available in initData");
        return false;
      }

      // Basic validation - in production, this should be validated server-side
      // with the bot token using Telegram's validation algorithm
      return true;
    } catch (error) {
      console.error("InitData validation error:", error);
      return false;
    }
  }

  public isValidUser(): boolean {
    // For development, always return true if no initData
    if (!WebApp.initData) {
      return true; // Development mode
    }
    return this.validateInitData();
  }

  public setHeaderColor(color: string): void {
    try {
      if (
        WebApp.setHeaderColor &&
        typeof WebApp.setHeaderColor === "function"
      ) {
        // Validate hex color format for Telegram
        const hexColor = color.startsWith("#") ? color : `#${color}`;
        WebApp.setHeaderColor(hexColor as `#${string}`);
      } else {
        console.info(
          "Header color setting not supported in this Telegram version"
        );
      }
    } catch (error) {
      console.info("Header color setting not available:", error);
    }
  }

  public getVersion(): string {
    return WebApp.version || "unknown";
  }

  public isSupported(feature: "expand" | "headerColor" | "haptics"): boolean {
    switch (feature) {
      case "expand":
        return WebApp.expand && typeof WebApp.expand === "function";
      case "headerColor":
        return (
          WebApp.setHeaderColor && typeof WebApp.setHeaderColor === "function"
        );
      case "haptics":
        return (
          WebApp.HapticFeedback &&
          typeof WebApp.HapticFeedback.impactOccurred === "function"
        );
      default:
        return false;
    }
  }
}

export const telegramService = TelegramService.getInstance();
