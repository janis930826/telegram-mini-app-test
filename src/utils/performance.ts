// Performance monitoring utilities for production optimization
import React from "react";

interface PerformanceMetrics {
  loadTime: number;
  renderTime: number;
  interactionTime: number;
  memoryUsage?: number;
}

interface PerformanceWithMemory extends Performance {
  memory: {
    usedJSHeapSize: number;
    totalJSHeapSize: number;
    jsHeapSizeLimit: number;
  };
}

class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: Map<string, number> = new Map();

  private constructor() {
    this.initializePerformanceObserver();
  }

  public static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  private initializePerformanceObserver() {
    if (typeof window !== "undefined" && "PerformanceObserver" in window) {
      try {
        // Observe Core Web Vitals
        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            this.recordMetric(entry.name, entry.startTime);
          }
        });

        observer.observe({ entryTypes: ["measure", "navigation", "paint"] });
      } catch (error) {
        console.debug("Performance Observer not supported:", error);
      }
    }
  }

  public markStart(label: string): void {
    if (typeof window !== "undefined" && "performance" in window) {
      performance.mark(`${label}-start`);
    }
  }

  public markEnd(label: string): number {
    if (typeof window !== "undefined" && "performance" in window) {
      const endMark = `${label}-end`;
      const startMark = `${label}-start`;

      performance.mark(endMark);

      try {
        performance.measure(label, startMark, endMark);
        const measure = performance.getEntriesByName(label)[0];
        const duration = measure.duration;

        this.recordMetric(label, duration);

        // Clean up marks and measures
        performance.clearMarks(startMark);
        performance.clearMarks(endMark);
        performance.clearMeasures(label);

        return duration;
      } catch (error) {
        console.debug(`Performance measurement failed for ${label}:`, error);
        return 0;
      }
    }
    return 0;
  }

  public recordMetric(name: string, value: number): void {
    this.metrics.set(name, value);

    // Log slow operations in development
    if (process.env.NODE_ENV === "development" && value > 100) {
      console.warn(
        `Slow operation detected: ${name} took ${value.toFixed(2)}ms`
      );
    }
  }

  public getMetrics(): Record<string, number> {
    return Object.fromEntries(this.metrics);
  }

  public getMemoryUsage(): number | null {
    if (
      typeof window !== "undefined" &&
      "performance" in window &&
      "memory" in performance
    ) {
      const memory = (performance as PerformanceWithMemory).memory;
      return memory.usedJSHeapSize / 1024 / 1024; // Convert to MB
    }
    return null;
  }

  public reportVitals(): PerformanceMetrics | null {
    if (typeof window === "undefined") return null;

    const navigation = performance.getEntriesByType(
      "navigation"
    )[0] as PerformanceNavigationTiming;
    if (!navigation) return null;

    const loadTime = navigation.loadEventEnd - navigation.loadEventStart;
    const renderTime =
      navigation.domContentLoadedEventEnd -
      navigation.domContentLoadedEventStart;
    const interactionTime = this.metrics.get("interaction-time") || 0;
    const memoryUsage = this.getMemoryUsage();

    const metrics: PerformanceMetrics = {
      loadTime,
      renderTime,
      interactionTime,
      ...(memoryUsage && { memoryUsage }),
    };

    // Log performance metrics in development
    if (process.env.NODE_ENV === "development") {
      console.table(metrics);
    }

    return metrics;
  }

  public trackInteraction(name: string, callback: () => void): () => void {
    return () => {
      this.markStart(`interaction-${name}`);
      callback();
      const duration = this.markEnd(`interaction-${name}`);

      // Track overall interaction time
      const currentInteractionTime = this.metrics.get("interaction-time") || 0;
      this.recordMetric("interaction-time", currentInteractionTime + duration);
    };
  }
}

export const performanceMonitor = PerformanceMonitor.getInstance();

// React hook for performance monitoring
export function usePerformanceMonitor(componentName: string) {
  React.useEffect(() => {
    performanceMonitor.markStart(`component-${componentName}`);

    return () => {
      performanceMonitor.markEnd(`component-${componentName}`);
    };
  }, [componentName]);
}
