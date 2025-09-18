import React, { Component, type ErrorInfo, type ReactNode } from "react";
import { motion } from "framer-motion";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);

    // In production, you would send this to your error tracking service
    // Example: Sentry.captureException(error, { extra: errorInfo });
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <motion.div
          className="error-boundary"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          style={{
            padding: "20px",
            margin: "20px",
            border: "2px solid #ff6b6b",
            borderRadius: "12px",
            backgroundColor: "#ffe0e0",
            textAlign: "center",
            color: "#d63031",
          }}>
          <motion.div
            initial={{ y: -10 }}
            animate={{ y: 0 }}
            transition={{ delay: 0.1 }}>
            <h3>🚨 Oops! Something went wrong</h3>
            <p>We're sorry, but something unexpected happened.</p>
            <details style={{ marginTop: "10px", textAlign: "left" }}>
              <summary style={{ cursor: "pointer", marginBottom: "5px" }}>
                Technical Details
              </summary>
              <pre
                style={{
                  fontSize: "12px",
                  backgroundColor: "#f8f9fa",
                  padding: "10px",
                  borderRadius: "4px",
                  overflow: "auto",
                  maxHeight: "200px",
                }}>
                {this.state.error?.stack || this.state.error?.message}
              </pre>
            </details>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.location.reload()}
              style={{
                marginTop: "15px",
                padding: "10px 20px",
                backgroundColor: "#74b9ff",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                fontSize: "14px",
              }}>
              🔄 Reload App
            </motion.button>
          </motion.div>
        </motion.div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
