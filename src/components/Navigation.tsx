import React from "react";

interface NavigationProps {
  currentPage: "home" | "tap" | "customize";
  onPageChange: (page: "home" | "tap" | "customize") => void;
}

const Navigation: React.FC<NavigationProps> = ({
  currentPage,
  onPageChange,
}) => {
  return (
    <nav className="app-navigation">
      <button
        className={`nav-btn ${currentPage === "home" ? "active" : ""}`}
        onClick={() => onPageChange("home")}>
        <span className="nav-icon">🏠</span>
        <span className="nav-label">Home</span>
      </button>

      <button
        className={`nav-btn ${currentPage === "tap" ? "active" : ""}`}
        onClick={() => onPageChange("tap")}>
        <span className="nav-icon">🎮</span>
        <span className="nav-label">Tap to Earn</span>
      </button>

      <button
        className={`nav-btn ${currentPage === "customize" ? "active" : ""}`}
        onClick={() => onPageChange("customize")}>
        <span className="nav-icon">🎨</span>
        <span className="nav-label">Customize</span>
      </button>
    </nav>
  );
};

export default Navigation;
