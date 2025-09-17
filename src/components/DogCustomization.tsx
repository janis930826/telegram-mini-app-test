import React, { useState } from "react";
import type {
  DogCustomization as DogCustomizationType,
  CustomizationOption,
} from "../types";
import { telegramService } from "../utils/telegram";
import { CUSTOMIZATION_OPTIONS } from "../utils/constants";
import DogSvg from "./DogSvg.tsx";

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

  const handleDragStart = (option: CustomizationOption) => {
    setDraggedItem(option);
    telegramService.hapticFeedback("light");
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
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
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const renderCustomizedDog = () => {
    return (
      <div className="dog-preview">
        <div className="dog-display">
          {/* Base dog SVG */}
          <div className="dog-svg-preview">
            <DogSvg
              bodyType={customization.body}
              frame={1} // Use first frame for preview
              color={customization.color}
              className="dog-preview-svg"
            />
          </div>

          {/* Hat overlay */}
          {customization.hat !== "none" && (
            <div className="dog-hat">
              {customization.hat === "cap" && "🧢"}
              {customization.hat === "crown" && "👑"}
              {customization.hat === "bow" && "🎀"}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="dog-customization">
      <h2>Customize Your Dog</h2>

      <div className="customization-workspace">
        <div
          className="dog-drop-zone"
          onDrop={handleDrop}
          onDragOver={handleDragOver}>
          <h3>Your Dog</h3>
          {renderCustomizedDog()}
          <p className="drop-hint">Drag items here to customize</p>
        </div>

        <div className="customization-options">
          {["body", "hat", "color"].map((category) => (
            <div key={category} className="option-category">
              <h4>{category.charAt(0).toUpperCase() + category.slice(1)}</h4>
              <div className="option-grid">
                {CUSTOMIZATION_OPTIONS.filter(
                  (option) => option.category === category
                ).map((option) => (
                  <div
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
                    }}>
                    <div className="option-preview">{option.preview}</div>
                    <div className="option-name">{option.name}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="customization-actions">
        <button
          className="save-btn"
          onClick={() => {
            telegramService.notificationFeedback("success");
            // Save customization logic would go here
          }}>
          Save Customization
        </button>
        <button
          className="reset-btn"
          onClick={() => {
            onCustomizationChange({
              body: "default",
              hat: "none",
              color: "brown",
            });
            telegramService.hapticFeedback("medium");
          }}>
          Reset to Default
        </button>
      </div>
    </div>
  );
};

export default DogCustomization;
