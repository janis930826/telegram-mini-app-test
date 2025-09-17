import React, { useState, Suspense, lazy } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type {
  DogCustomization as DogCustomizationType,
  CustomizationOption,
} from "../types";
import { telegramService } from "../utils/telegram";
import { CUSTOMIZATION_OPTIONS, TOTAL_COMBINATIONS } from "../utils/constants";

// Lazy load DogSvg for optimization
const DogSvg = lazy(() => import("./DogSvg"));

interface DogCustomizationProps {
  customization: DogCustomizationType;
  onCustomizationChange: (customization: DogCustomizationType) => void;
}

const DogCustomization: React.FC<DogCustomizationProps> = ({
  customization,
  onCustomizationChange,
}) => {
  const [draggedItem, setDraggedItem] = useState<CustomizationOption | null>(
    null
  );
  const [previewCustomization, setPreviewCustomization] =
    useState<DogCustomizationType | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragStart = (option: CustomizationOption) => {
    setDraggedItem(option);
    telegramService.hapticFeedback("light");
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
    setPreviewCustomization(null);
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    if (draggedItem) {
      const newCustomization = { ...customization };

      switch (draggedItem.category) {
        case "body":
          newCustomization.body =
            draggedItem.id as DogCustomizationType["body"];
          break;
        case "hat":
          newCustomization.hat = draggedItem.id as DogCustomizationType["hat"];
          break;
        case "color":
          newCustomization.color =
            draggedItem.id as DogCustomizationType["color"];
          break;
      }

      onCustomizationChange(newCustomization);
      telegramService.hapticFeedback("medium");
      telegramService.notificationFeedback("success");
    }

    setPreviewCustomization(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);

    // Show instant preview while dragging
    if (draggedItem) {
      const preview = { ...customization };
      switch (draggedItem.category) {
        case "body":
          preview.body = draggedItem.id as DogCustomizationType["body"];
          break;
        case "hat":
          preview.hat = draggedItem.id as DogCustomizationType["hat"];
          break;
        case "color":
          preview.color = draggedItem.id as DogCustomizationType["color"];
          break;
      }
      setPreviewCustomization(preview);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    // Only reset if we're actually leaving the drop zone
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setIsDragOver(false);
      setPreviewCustomization(null);
    }
  };

  const renderCustomizedDog = (displayCustomization = customization) => {
    return (
      <motion.div
        className="dog-preview"
        animate={isDragOver ? { scale: 1.05 } : { scale: 1 }}
        transition={{ duration: 0.2 }}>
        <div className="dog-display">
          {/* Base dog SVG */}
          <div className="dog-svg-preview">
            <Suspense fallback={<div className="dog-loading">🐕</div>}>
              <DogSvg
                bodyType={displayCustomization.body}
                frame={1} // Use first frame for preview
                color={displayCustomization.color}
                className="dog-preview-svg"
              />
            </Suspense>
          </div>

          {/* Hat overlay */}
          <AnimatePresence>
            {displayCustomization.hat !== "none" && (
              <motion.div
                className="dog-hat"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0, rotate: 180 }}
                transition={{ duration: 0.3, type: "spring" }}>
                {displayCustomization.hat === "cap" && "🧢"}
                {displayCustomization.hat === "crown" && "👑"}
                {displayCustomization.hat === "bow" && "🎀"}
                {displayCustomization.hat === "headband" && "🎯"}
                {displayCustomization.hat === "santa" && "🎅"}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    );
  };

  return (
    <motion.div
      className="dog-customization"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}>
      <motion.h2
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring" }}>
        🎨 Customize Your Dog
      </motion.h2>

      <div className="customization-workspace">
        <motion.div
          className={`dog-drop-zone ${isDragOver ? "drag-over" : ""}`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}>
          <h3>Your Dog</h3>
          {renderCustomizedDog(previewCustomization || customization)}
          <motion.p
            className="drop-hint"
            animate={
              isDragOver ? { scale: 1.1, color: "#4caf50" } : { scale: 1 }
            }>
            {isDragOver
              ? "Drop here to apply!"
              : "Drag items here to customize"}
          </motion.p>

          {/* Combination counter */}
          <motion.div
            className="combination-counter"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}>
            <small>
              🎯{" "}
              {
                CUSTOMIZATION_OPTIONS.filter((opt) => opt.category === "body")
                  .length
              }{" "}
              ×{" "}
              {
                CUSTOMIZATION_OPTIONS.filter((opt) => opt.category === "hat")
                  .length
              }{" "}
              ×{" "}
              {
                CUSTOMIZATION_OPTIONS.filter((opt) => opt.category === "color")
                  .length
              }{" "}
              = {TOTAL_COMBINATIONS.toLocaleString()} possible combinations!
            </small>
          </motion.div>
        </motion.div>

        <motion.div
          className="customization-options"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}>
          {["body", "hat", "color"].map((category, categoryIndex) => (
            <motion.div
              key={category}
              className="option-category"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + categoryIndex * 0.1 }}>
              <h4>
                {category === "body" && "🐕"}
                {category === "hat" && "👒"}
                {category === "color" && "🎨"}
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </h4>
              <div className="option-grid">
                {CUSTOMIZATION_OPTIONS.filter(
                  (option) => option.category === category
                ).map((option, optionIndex) => (
                  <motion.div
                    key={option.id}
                    className={`option-item ${
                      customization[category as keyof DogCustomizationType] ===
                      option.id
                        ? "selected"
                        : ""
                    }`}
                    draggable
                    onDragStart={() => handleDragStart(option)}
                    onDragEnd={handleDragEnd}
                    onClick={() => {
                      const newCustomization = { ...customization };
                      (newCustomization as Record<string, string>)[category] =
                        option.id;
                      onCustomizationChange(newCustomization);
                      telegramService.hapticFeedback("light");
                    }}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    whileDrag={{ scale: 1.1, rotate: 5, zIndex: 1000 }}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{
                      delay: 0.5 + categoryIndex * 0.1 + optionIndex * 0.05,
                      type: "spring",
                      stiffness: 200,
                    }}>
                    <div className="option-preview">{option.preview}</div>
                    <div className="option-name">{option.name}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      <motion.div
        className="customization-actions"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}>
        <motion.button
          className="save-btn"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            telegramService.notificationFeedback("success");
            // Save customization logic would go here
          }}>
          💾 Save Customization
        </motion.button>
        <motion.button
          className="reset-btn"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            onCustomizationChange({
              body: "default",
              hat: "none",
              color: "brown",
            });
            telegramService.hapticFeedback("medium");
          }}>
          🔄 Reset to Default
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

export default DogCustomization;
