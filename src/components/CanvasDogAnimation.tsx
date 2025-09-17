import React, { useState, useEffect, useRef, useMemo } from "react";
import { Stage, Layer, Circle, Ellipse, Path, Group } from "react-konva";
import Konva from "konva";
import { telegramService } from "../utils/telegram";
import type { DogCustomization } from "../types";
import {
  DOG_OPTIONS,
  ANIMATION_CONFIG,
  SVG_CONSTANTS,
} from "../utils/constants";

interface CanvasDogAnimationProps {
  onTap: () => void;
  isAnimating: boolean;
  customization: DogCustomization;
}

const CanvasDogAnimation: React.FC<CanvasDogAnimationProps> = ({
  onTap,
  isAnimating,
  customization,
}) => {
  const [tapEffect, setTapEffect] = useState(false);
  const [currentFrame, setCurrentFrame] = useState(1);
  const [forceNeutral, setForceNeutral] = useState(false);
  const dogGroupRef = useRef<Konva.Group>(null);
  const tapRippleRef = useRef<Konva.Circle>(null);
  const frameIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const currentTweenRef = useRef<Konva.Tween | null>(null);

  // Get color value
  const colorValue =
    DOG_OPTIONS.COLORS[
      customization.color as keyof typeof DOG_OPTIONS.COLORS
    ] || DOG_OPTIONS.COLORS.brown;

  // Single animation control - completely stop all animation when isAnimating is false
  useEffect(() => {
    // Always clear any existing intervals and tweens first
    if (frameIntervalRef.current) {
      clearInterval(frameIntervalRef.current);
      frameIntervalRef.current = null;
    }

    if (currentTweenRef.current) {
      currentTweenRef.current.destroy();
      currentTweenRef.current = null;
    }

    if (isAnimating) {
      // Start animation
      setForceNeutral(false);
      let frame = 1;

      frameIntervalRef.current = setInterval(() => {
        frame = (frame % 3) + 1;
        setCurrentFrame(frame);

        // Animate position based on frame
        if (dogGroupRef.current) {
          const group = dogGroupRef.current;
          let targetY = 0;
          let targetScaleY = 1;

          switch (frame) {
            case 1:
              targetY = 0;
              targetScaleY = 1;
              break;
            case 2:
              targetY = -5;
              targetScaleY = 1.05;
              break;
            case 3:
              targetY = -10;
              targetScaleY = 1.1;
              break;
          }

          // Clean up any existing tween
          if (currentTweenRef.current) {
            currentTweenRef.current.destroy();
          }

          // Create new tween
          currentTweenRef.current = new Konva.Tween({
            node: group,
            duration: ANIMATION_CONFIG.FRAME_DURATION / 1000,
            y: targetY,
            scaleY: targetScaleY,
            easing: Konva.Easings.EaseInOut,
          });

          currentTweenRef.current.play();
        }
      }, ANIMATION_CONFIG.FRAME_DURATION);
    } else {
      // COMPLETELY STOP animation
      setCurrentFrame(1);
      setForceNeutral(true);

      // Immediately reset dog position and force re-render
      if (dogGroupRef.current) {
        dogGroupRef.current.y(0);
        dogGroupRef.current.scaleY(1);
        dogGroupRef.current.getLayer()?.batchDraw(); // Force redraw
      }

      // Additional safety: force state update after a brief delay
      setTimeout(() => {
        setCurrentFrame(1);
        setForceNeutral(true);
      }, 10);
    }

    return () => {
      // Cleanup on effect change or unmount
      if (frameIntervalRef.current) {
        clearInterval(frameIntervalRef.current);
        frameIntervalRef.current = null;
      }
      if (currentTweenRef.current) {
        currentTweenRef.current.destroy();
        currentTweenRef.current = null;
      }
    };
  }, [isAnimating]); // Only depend on isAnimating

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (frameIntervalRef.current) {
        clearInterval(frameIntervalRef.current);
      }
      if (currentTweenRef.current) {
        currentTweenRef.current.destroy();
      }
    };
  }, []);

  const getHatEmoji = (hatType: string): string => {
    return (
      DOG_OPTIONS.HATS[hatType as keyof typeof DOG_OPTIONS.HATS] ||
      DOG_OPTIONS.HATS.none
    );
  };

  const handleTap = () => {
    // Trigger haptic feedback
    telegramService.hapticFeedback("medium");

    // Visual tap effect with canvas animation
    setTapEffect(true);

    // Animate tap ripple
    if (tapRippleRef.current) {
      const ripple = tapRippleRef.current;
      ripple.radius(0);
      ripple.opacity(0.6);

      const rippleTween = new Konva.Tween({
        node: ripple,
        duration: ANIMATION_CONFIG.TAP_EFFECT_DURATION / 1000,
        radius: 60,
        opacity: 0,
        easing: Konva.Easings.EaseOut,
        onFinish: () => {
          setTapEffect(false);
        },
      });

      rippleTween.play();
    }

    // Bounce effect on dog - simple scale up and back down
    if (dogGroupRef.current) {
      const group = dogGroupRef.current;
      const bounceTween = new Konva.Tween({
        node: group,
        duration: 0.1,
        scaleX: 1.1,
        scaleY: 1.1,
        easing: Konva.Easings.EaseOut,
        onFinish: () => {
          // Scale back down to normal
          const returnTween = new Konva.Tween({
            node: group,
            duration: 0.1,
            scaleX: 1,
            scaleY: 1,
            easing: Konva.Easings.EaseIn,
          });
          returnTween.play();
        },
      });

      bounceTween.play();
    }

    // Call the parent's onTap function
    onTap();

    setTimeout(() => setTapEffect(false), ANIMATION_CONFIG.TAP_EFFECT_DURATION);
  };

  // Get body type configuration
  const getBodyConfig = () => {
    switch (customization.body) {
      case "fluffy":
        return SVG_CONSTANTS.BODY.FLUFFY;
      case "slim":
        return SVG_CONSTANTS.BODY.SLIM;
      default:
        return SVG_CONSTANTS.BODY.DEFAULT;
    }
  };

  const getHeadConfig = () => {
    switch (customization.body) {
      case "fluffy":
        return SVG_CONSTANTS.HEAD.FLUFFY;
      case "slim":
        return SVG_CONSTANTS.HEAD.SLIM;
      default:
        return SVG_CONSTANTS.HEAD.DEFAULT;
    }
  };

  const getEarsConfig = () => {
    switch (customization.body) {
      case "fluffy":
        return SVG_CONSTANTS.EARS.FLUFFY;
      case "slim":
        return SVG_CONSTANTS.EARS.SLIM;
      default:
        return SVG_CONSTANTS.EARS.DEFAULT;
    }
  };

  const getEyesConfig = () => {
    return customization.body === "slim"
      ? SVG_CONSTANTS.EYES.SLIM
      : SVG_CONSTANTS.EYES.DEFAULT;
  };

  const getLegsConfig = () => {
    switch (customization.body) {
      case "fluffy":
        return SVG_CONSTANTS.LEGS.FLUFFY;
      case "slim":
        return SVG_CONSTANTS.LEGS.SLIM;
      default:
        return SVG_CONSTANTS.LEGS.DEFAULT;
    }
  };

  const bodyConfig = getBodyConfig();
  const headConfig = getHeadConfig();
  const earsConfig = getEarsConfig();
  const eyesConfig = getEyesConfig();
  const legsConfig = getLegsConfig();

  // Force neutral state immediately when not animating
  const frameConfig = useMemo(() => {
    const baseConfig = {
      earRotation: { left: -30, right: 30 },
      eyeScale: 1,
      tongueVisible: false,
      legRotations: [0, 0, 0, 0],
      tailPath: "M 85 65 Q 95 55 90 45",
    };

    // If not animating or forced to neutral, always return base config (neutral state)
    if (!isAnimating || forceNeutral) {
      return baseConfig;
    }

    switch (currentFrame) {
      case 2:
        return {
          ...baseConfig,
          earRotation: { left: -20, right: 20 },
          eyeScale: 1.3,
          tongueVisible: true,
          legRotations: [-5, 3, -3, 5],
          tailPath: "M 85 65 Q 100 50 95 35",
        };
      case 3:
        return {
          ...baseConfig,
          earRotation: { left: -10, right: 10 },
          eyeScale: 1.6,
          tongueVisible: true,
          legRotations: [-10, 8, -8, 10],
          tailPath: "M 85 65 Q 105 45 100 25",
        };
      default:
        return baseConfig;
    }
  }, [isAnimating, currentFrame, forceNeutral]);

  return (
    <div className="dog-animation-container">
      <div
        className={`canvas-dog-wrapper ${isAnimating ? "bouncing" : ""}`}
        style={{ position: "relative", display: "inline-block" }}>
        <Stage
          width={SVG_CONSTANTS.WIDTH}
          height={SVG_CONSTANTS.HEIGHT}
          onClick={handleTap}
          style={{ cursor: "pointer" }}>
          <Layer>
            {/* Dog Group */}
            <Group ref={dogGroupRef}>
              {/* Body */}
              <Ellipse
                x={bodyConfig.cx}
                y={bodyConfig.cy}
                radiusX={bodyConfig.rx}
                radiusY={bodyConfig.ry}
                fill={colorValue}
                stroke={SVG_CONSTANTS.COLORS.STROKE}
                strokeWidth={SVG_CONSTANTS.STROKE_WIDTH.BODY}
              />

              {/* Fluffy texture for fluffy body type */}
              {customization.body === "fluffy" && (
                <>
                  {SVG_CONSTANTS.FLUFFY_TEXTURE.BODY.map((circle, index) => (
                    <Circle
                      key={`body-texture-${index}`}
                      x={circle.cx}
                      y={circle.cy}
                      radius={circle.r}
                      fill={colorValue}
                      opacity={circle.opacity}
                    />
                  ))}
                </>
              )}

              {/* Head */}
              {"r" in headConfig ? (
                <Circle
                  x={headConfig.cx}
                  y={headConfig.cy}
                  radius={headConfig.r}
                  fill={colorValue}
                  stroke={SVG_CONSTANTS.COLORS.STROKE}
                  strokeWidth={SVG_CONSTANTS.STROKE_WIDTH.BODY}
                />
              ) : (
                <Ellipse
                  x={headConfig.cx}
                  y={headConfig.cy}
                  radiusX={headConfig.rx}
                  radiusY={headConfig.ry}
                  fill={colorValue}
                  stroke={SVG_CONSTANTS.COLORS.STROKE}
                  strokeWidth={SVG_CONSTANTS.STROKE_WIDTH.BODY}
                />
              )}

              {/* Fluffy head texture */}
              {customization.body === "fluffy" && (
                <>
                  {SVG_CONSTANTS.FLUFFY_TEXTURE.HEAD.map((circle, index) => (
                    <Circle
                      key={`head-texture-${index}`}
                      x={circle.cx}
                      y={circle.cy}
                      radius={circle.r}
                      fill={colorValue}
                      opacity={circle.opacity}
                    />
                  ))}
                </>
              )}

              {/* Ears */}
              <Ellipse
                x={earsConfig.LEFT.cx}
                y={earsConfig.LEFT.cy}
                radiusX={earsConfig.LEFT.rx}
                radiusY={earsConfig.LEFT.ry}
                fill={colorValue}
                stroke={SVG_CONSTANTS.COLORS.STROKE}
                strokeWidth={SVG_CONSTANTS.STROKE_WIDTH.EARS}
                rotation={frameConfig.earRotation.left}
              />
              <Ellipse
                x={earsConfig.RIGHT.cx}
                y={earsConfig.RIGHT.cy}
                radiusX={earsConfig.RIGHT.rx}
                radiusY={earsConfig.RIGHT.ry}
                fill={colorValue}
                stroke={SVG_CONSTANTS.COLORS.STROKE}
                strokeWidth={SVG_CONSTANTS.STROKE_WIDTH.EARS}
                rotation={frameConfig.earRotation.right}
              />

              {/* Eyes */}
              <Circle
                x={eyesConfig.LEFT.cx}
                y={eyesConfig.LEFT.cy}
                radius={eyesConfig.LEFT.r * frameConfig.eyeScale}
                fill={SVG_CONSTANTS.COLORS.STROKE}
              />
              <Circle
                x={eyesConfig.RIGHT.cx}
                y={eyesConfig.RIGHT.cy}
                radius={eyesConfig.RIGHT.r * frameConfig.eyeScale}
                fill={SVG_CONSTANTS.COLORS.STROKE}
              />

              {/* Eye highlights */}
              <Circle
                x={eyesConfig.LEFT_HIGHLIGHT.cx}
                y={
                  eyesConfig.LEFT_HIGHLIGHT.cy - (frameConfig.eyeScale - 1) * 2
                }
                radius={eyesConfig.LEFT_HIGHLIGHT.r * frameConfig.eyeScale}
                fill={SVG_CONSTANTS.COLORS.WHITE}
              />
              <Circle
                x={eyesConfig.RIGHT_HIGHLIGHT.cx}
                y={
                  eyesConfig.RIGHT_HIGHLIGHT.cy - (frameConfig.eyeScale - 1) * 2
                }
                radius={eyesConfig.RIGHT_HIGHLIGHT.r * frameConfig.eyeScale}
                fill={SVG_CONSTANTS.COLORS.WHITE}
              />

              {/* Nose */}
              <Ellipse
                x={SVG_CONSTANTS.NOSE.cx}
                y={SVG_CONSTANTS.NOSE.cy}
                radiusX={SVG_CONSTANTS.NOSE.rx}
                radiusY={SVG_CONSTANTS.NOSE.ry}
                fill={SVG_CONSTANTS.COLORS.STROKE}
              />

              {/* Mouth */}
              <Path
                data="M 60 42 Q 55 45 50 42"
                stroke={SVG_CONSTANTS.COLORS.STROKE}
                strokeWidth={SVG_CONSTANTS.STROKE_WIDTH.MOUTH}
                fill=""
              />
              <Path
                data="M 60 42 Q 65 45 70 42"
                stroke={SVG_CONSTANTS.COLORS.STROKE}
                strokeWidth={SVG_CONSTANTS.STROKE_WIDTH.MOUTH}
                fill=""
              />

              {/* Tongue (visible in frames 2 and 3) */}
              {frameConfig.tongueVisible && (
                <Ellipse
                  x={60}
                  y={45 + (currentFrame - 2) * 2}
                  radiusX={3 + (currentFrame - 2)}
                  radiusY={2 + (currentFrame - 2)}
                  fill={SVG_CONSTANTS.COLORS.TONGUE}
                />
              )}

              {/* Legs */}
              {legsConfig.map((leg, index) => (
                <Ellipse
                  key={`leg-${index}`}
                  x={leg.cx}
                  y={leg.cy}
                  radiusX={leg.rx}
                  radiusY={leg.ry}
                  fill={colorValue}
                  stroke={SVG_CONSTANTS.COLORS.STROKE}
                  strokeWidth={SVG_CONSTANTS.STROKE_WIDTH.LEGS}
                  rotation={frameConfig.legRotations[index]}
                />
              ))}

              {/* Tail */}
              <Path
                data={frameConfig.tailPath}
                stroke={colorValue}
                strokeWidth={
                  customization.body === "fluffy"
                    ? SVG_CONSTANTS.STROKE_WIDTH.TAIL_FLUFFY
                    : customization.body === "slim"
                    ? SVG_CONSTANTS.STROKE_WIDTH.TAIL_SLIM
                    : SVG_CONSTANTS.STROKE_WIDTH.TAIL_DEFAULT
                }
                fill=""
                lineCap="round"
              />

              {/* Fluffy tail circle */}
              {customization.body === "fluffy" && (
                <Circle
                  x={97 + (currentFrame - 1) * 5}
                  y={50 - (currentFrame - 1) * 8}
                  radius={2}
                  fill={colorValue}
                  opacity={0.7}
                />
              )}
            </Group>

            {/* Tap Ripple Effect */}
            {tapEffect && (
              <Circle
                ref={tapRippleRef}
                x={SVG_CONSTANTS.WIDTH / 2}
                y={SVG_CONSTANTS.HEIGHT / 2}
                radius={0}
                fill=""
                stroke={colorValue}
                strokeWidth={2}
                opacity={0.6}
              />
            )}
          </Layer>
        </Stage>

        {/* Hat overlay (appears above canvas) */}
        {customization.hat !== "none" && (
          <div
            className="dog-hat-overlay"
            style={{
              position: "absolute",
              top: "-28px",
              left: "50%",
              transform: "translateX(-50%)",
              fontSize: "40px",
              pointerEvents: "none",
              zIndex: 10,
            }}>
            {getHatEmoji(customization.hat)}
          </div>
        )}
      </div>
    </div>
  );
};

export default CanvasDogAnimation;
