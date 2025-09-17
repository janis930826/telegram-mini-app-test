import React from "react";
import { DOG_OPTIONS, SVG_CONSTANTS } from "../utils/constants";

interface DogSvgProps {
  bodyType: "default" | "fluffy" | "slim";
  frame: 1 | 2 | 3;
  color: string;
  className?: string;
}

// Helper functions for common SVG elements
const createBody = (bodyType: keyof typeof SVG_CONSTANTS.BODY) => {
  const body = SVG_CONSTANTS.BODY[bodyType];
  return (
    <ellipse
      cx={body.cx}
      cy={body.cy}
      rx={body.rx}
      ry={body.ry}
      fill="currentColor"
      stroke={SVG_CONSTANTS.COLORS.STROKE}
      strokeWidth={SVG_CONSTANTS.STROKE_WIDTH.BODY}
    />
  );
};

const createHead = (bodyType: keyof typeof SVG_CONSTANTS.HEAD) => {
  const head = SVG_CONSTANTS.HEAD[bodyType];

  if ("r" in head) {
    // Circle head (default and fluffy)
    return (
      <circle
        cx={head.cx}
        cy={head.cy}
        r={head.r}
        fill="currentColor"
        stroke={SVG_CONSTANTS.COLORS.STROKE}
        strokeWidth={SVG_CONSTANTS.STROKE_WIDTH.BODY}
      />
    );
  } else {
    // Ellipse head (slim)
    return (
      <ellipse
        cx={head.cx}
        cy={head.cy}
        rx={head.rx}
        ry={head.ry}
        fill="currentColor"
        stroke={SVG_CONSTANTS.COLORS.STROKE}
        strokeWidth={SVG_CONSTANTS.STROKE_WIDTH.BODY}
      />
    );
  }
};

const createEars = (
  bodyType: keyof typeof SVG_CONSTANTS.EARS,
  rotation: { left: number; right: number }
) => {
  const ears = SVG_CONSTANTS.EARS[bodyType];
  return (
    <>
      <ellipse
        cx={ears.LEFT.cx}
        cy={ears.LEFT.cy}
        rx={ears.LEFT.rx}
        ry={ears.LEFT.ry}
        fill="currentColor"
        stroke={SVG_CONSTANTS.COLORS.STROKE}
        strokeWidth={SVG_CONSTANTS.STROKE_WIDTH.EARS}
        transform={`rotate(${rotation.left} ${ears.LEFT.cx} ${ears.LEFT.cy})`}
      />
      <ellipse
        cx={ears.RIGHT.cx}
        cy={ears.RIGHT.cy}
        rx={ears.RIGHT.rx}
        ry={ears.RIGHT.ry}
        fill="currentColor"
        stroke={SVG_CONSTANTS.COLORS.STROKE}
        strokeWidth={SVG_CONSTANTS.STROKE_WIDTH.EARS}
        transform={`rotate(${rotation.right} ${ears.RIGHT.cx} ${ears.RIGHT.cy})`}
      />
    </>
  );
};

const createEyes = (
  bodyType: keyof typeof SVG_CONSTANTS.EYES,
  size?: {
    r: number;
    highlightR: number;
    highlightOffset?: { x: number; y: number };
  }
) => {
  const eyes = SVG_CONSTANTS.EYES[bodyType] || SVG_CONSTANTS.EYES.DEFAULT;
  const eyeSize = size?.r || eyes.LEFT.r;
  const highlightSize = size?.highlightR || eyes.LEFT_HIGHLIGHT.r;
  const highlightOffset = size?.highlightOffset || { x: 0, y: 0 };

  return (
    <>
      <circle
        cx={eyes.LEFT.cx}
        cy={eyes.LEFT.cy}
        r={eyeSize}
        fill={SVG_CONSTANTS.COLORS.STROKE}
      />
      <circle
        cx={eyes.RIGHT.cx}
        cy={eyes.RIGHT.cy}
        r={eyeSize}
        fill={SVG_CONSTANTS.COLORS.STROKE}
      />
      <circle
        cx={eyes.LEFT_HIGHLIGHT.cx + highlightOffset.x}
        cy={eyes.LEFT_HIGHLIGHT.cy + highlightOffset.y}
        r={highlightSize}
        fill={SVG_CONSTANTS.COLORS.WHITE}
      />
      <circle
        cx={eyes.RIGHT_HIGHLIGHT.cx + highlightOffset.x}
        cy={eyes.RIGHT_HIGHLIGHT.cy + highlightOffset.y}
        r={highlightSize}
        fill={SVG_CONSTANTS.COLORS.WHITE}
      />
    </>
  );
};

const createNose = () => (
  <ellipse
    cx={SVG_CONSTANTS.NOSE.cx}
    cy={SVG_CONSTANTS.NOSE.cy}
    rx={SVG_CONSTANTS.NOSE.rx}
    ry={SVG_CONSTANTS.NOSE.ry}
    fill={SVG_CONSTANTS.COLORS.STROKE}
  />
);

const createMouth = (paths: string[]) => (
  <>
    {paths.map((path, index) => (
      <path
        key={index}
        d={path}
        stroke={SVG_CONSTANTS.COLORS.STROKE}
        strokeWidth={SVG_CONSTANTS.STROKE_WIDTH.MOUTH}
        fill="none"
      />
    ))}
  </>
);

const createTongue = (tongue: {
  cx: number;
  cy: number;
  rx: number;
  ry: number;
}) => (
  <ellipse
    cx={tongue.cx}
    cy={tongue.cy}
    rx={tongue.rx}
    ry={tongue.ry}
    fill={SVG_CONSTANTS.COLORS.TONGUE}
  />
);

const createLegs = (
  bodyType: keyof typeof SVG_CONSTANTS.LEGS,
  rotations?: number[]
) => {
  const legs = SVG_CONSTANTS.LEGS[bodyType];
  return (
    <>
      {legs.map((leg, index) => (
        <ellipse
          key={index}
          cx={leg.cx}
          cy={leg.cy}
          rx={leg.rx}
          ry={leg.ry}
          fill="currentColor"
          stroke={SVG_CONSTANTS.COLORS.STROKE}
          strokeWidth={SVG_CONSTANTS.STROKE_WIDTH.LEGS}
          transform={
            rotations?.[index]
              ? `rotate(${rotations[index]} ${leg.cx} ${leg.cy})`
              : undefined
          }
        />
      ))}
    </>
  );
};

const createFluffyTexture = () => (
  <>
    {/* Body texture */}
    {SVG_CONSTANTS.FLUFFY_TEXTURE.BODY.map((circle, index) => (
      <circle
        key={`body-${index}`}
        cx={circle.cx}
        cy={circle.cy}
        r={circle.r}
        fill="currentColor"
        opacity={circle.opacity}
      />
    ))}
    {/* Head texture */}
    {SVG_CONSTANTS.FLUFFY_TEXTURE.HEAD.map((circle, index) => (
      <circle
        key={`head-${index}`}
        cx={circle.cx}
        cy={circle.cy}
        r={circle.r}
        fill="currentColor"
        opacity={circle.opacity}
      />
    ))}
  </>
);

const DogSvg: React.FC<DogSvgProps> = ({
  bodyType,
  frame,
  color,
  className,
}) => {
  const colorValue =
    DOG_OPTIONS.COLORS[color as keyof typeof DOG_OPTIONS.COLORS] ||
    DOG_OPTIONS.COLORS.brown;

  // Generic render function that handles all body types and frames
  const renderDogFrame = (
    bodyType: "DEFAULT" | "FLUFFY" | "SLIM",
    frameConfig: {
      transform?: string;
      earRotation: { left: number; right: number };
      eyeConfig?: {
        r: number;
        highlightR: number;
        highlightOffset?: { x: number; y: number };
      };
      mouthPaths: string[];
      tongueConfig?: { cx: number; cy: number; rx: number; ry: number };
      legRotations?: number[];
      tailPath: string;
      tailStrokeWidth: number;
      fluffyTailCircle?: { cx: number; cy: number; r: number; opacity: number };
    }
  ) => (
    <svg
      width={SVG_CONSTANTS.WIDTH}
      height={SVG_CONSTANTS.HEIGHT}
      viewBox={SVG_CONSTANTS.VIEWBOX}
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ color: colorValue }}>
      <g id="dog-body" transform={frameConfig.transform}>
        {createBody(bodyType)}
        {bodyType === "FLUFFY" && createFluffyTexture()}
        {createHead(bodyType)}
        {createEars(bodyType, frameConfig.earRotation)}
        {createEyes(
          bodyType === "SLIM" ? "SLIM" : "DEFAULT",
          frameConfig.eyeConfig
        )}
        {createNose()}
        {createMouth(frameConfig.mouthPaths)}
        {frameConfig.tongueConfig && createTongue(frameConfig.tongueConfig)}
        {createLegs(bodyType, frameConfig.legRotations)}
        <path
          d={frameConfig.tailPath}
          stroke="currentColor"
          strokeWidth={frameConfig.tailStrokeWidth}
          fill="none"
          strokeLinecap="round"
        />
        {frameConfig.fluffyTailCircle && (
          <circle
            cx={frameConfig.fluffyTailCircle.cx}
            cy={frameConfig.fluffyTailCircle.cy}
            r={frameConfig.fluffyTailCircle.r}
            fill="currentColor"
            opacity={frameConfig.fluffyTailCircle.opacity}
          />
        )}
      </g>
    </svg>
  );

  const renderDefaultFrame1 = () =>
    renderDogFrame("DEFAULT", {
      earRotation: { left: -30, right: 30 },
      mouthPaths: ["M 60 42 Q 55 45 50 42", "M 60 42 Q 65 45 70 42"],
      tailPath: "M 85 65 Q 95 55 90 45",
      tailStrokeWidth: SVG_CONSTANTS.STROKE_WIDTH.TAIL_DEFAULT,
    });

  const renderDefaultFrame2 = () =>
    renderDogFrame("DEFAULT", {
      transform: SVG_CONSTANTS.TRANSFORMS.FRAME2,
      earRotation: { left: -20, right: 20 },
      eyeConfig: { r: 4, highlightR: 1.5, highlightOffset: { x: 0, y: -1 } },
      mouthPaths: ["M 60 42 Q 55 47 48 44", "M 60 42 Q 65 47 72 44"],
      tongueConfig: { cx: 60, cy: 45, rx: 3, ry: 2 },
      legRotations: [-5, 3, -3, 5],
      tailPath: "M 85 65 Q 100 50 95 35",
      tailStrokeWidth: SVG_CONSTANTS.STROKE_WIDTH.TAIL_DEFAULT,
    });

  const renderDefaultFrame3 = () =>
    renderDogFrame("DEFAULT", {
      transform: SVG_CONSTANTS.TRANSFORMS.FRAME3,
      earRotation: { left: -10, right: 10 },
      eyeConfig: { r: 4, highlightR: 2, highlightOffset: { x: 0, y: -2 } },
      mouthPaths: ["M 60 42 Q 55 50 45 46", "M 60 42 Q 65 50 75 46"],
      tongueConfig: { cx: 60, cy: 47, rx: 4, ry: 3 },
      legRotations: [-10, 8, -8, 10],
      tailPath: "M 85 65 Q 105 45 100 25",
      tailStrokeWidth: SVG_CONSTANTS.STROKE_WIDTH.TAIL_DEFAULT,
    });

  const renderFluffyFrame1 = () =>
    renderDogFrame("FLUFFY", {
      earRotation: { left: -30, right: 30 },
      mouthPaths: ["M 60 42 Q 55 45 50 42", "M 60 42 Q 65 45 70 42"],
      tailPath: "M 90 65 Q 100 55 95 45",
      tailStrokeWidth: SVG_CONSTANTS.STROKE_WIDTH.TAIL_FLUFFY,
      fluffyTailCircle: { cx: 97, cy: 50, r: 2, opacity: 0.7 },
    });

  const renderFluffyFrame2 = () =>
    renderDogFrame("FLUFFY", {
      transform: SVG_CONSTANTS.TRANSFORMS.FRAME2,
      earRotation: { left: -20, right: 20 },
      eyeConfig: { r: 4, highlightR: 1.5, highlightOffset: { x: 0, y: -1 } },
      mouthPaths: ["M 60 42 Q 55 47 48 44", "M 60 42 Q 65 47 72 44"],
      tongueConfig: { cx: 60, cy: 45, rx: 3, ry: 2 },
      legRotations: [-5, 3, -3, 5],
      tailPath: "M 90 65 Q 105 50 100 35",
      tailStrokeWidth: SVG_CONSTANTS.STROKE_WIDTH.TAIL_FLUFFY,
      fluffyTailCircle: { cx: 102, cy: 42, r: 2, opacity: 0.7 },
    });

  const renderFluffyFrame3 = () =>
    renderDogFrame("FLUFFY", {
      transform: SVG_CONSTANTS.TRANSFORMS.FRAME3,
      earRotation: { left: -10, right: 10 },
      eyeConfig: { r: 4, highlightR: 2, highlightOffset: { x: 0, y: -2 } },
      mouthPaths: ["M 60 42 Q 55 50 45 46", "M 60 42 Q 65 50 75 46"],
      tongueConfig: { cx: 60, cy: 47, rx: 4, ry: 3 },
      legRotations: [-10, 8, -8, 10],
      tailPath: "M 90 65 Q 110 45 105 25",
      tailStrokeWidth: SVG_CONSTANTS.STROKE_WIDTH.TAIL_FLUFFY,
      fluffyTailCircle: { cx: 107, cy: 35, r: 2, opacity: 0.7 },
    });

  const renderSlimFrame1 = () =>
    renderDogFrame("SLIM", {
      earRotation: { left: -25, right: 25 },
      mouthPaths: ["M 60 42 Q 55 45 52 42", "M 60 42 Q 65 45 68 42"],
      tailPath: "M 80 65 Q 92 52 88 40",
      tailStrokeWidth: SVG_CONSTANTS.STROKE_WIDTH.TAIL_SLIM,
    });

  const renderSlimFrame2 = () =>
    renderDogFrame("SLIM", {
      transform: SVG_CONSTANTS.TRANSFORMS.FRAME2,
      earRotation: { left: -15, right: 15 },
      eyeConfig: { r: 4, highlightR: 1.5, highlightOffset: { x: 0, y: -1 } },
      mouthPaths: ["M 60 42 Q 55 47 50 44", "M 60 42 Q 65 47 70 44"],
      tongueConfig: { cx: 60, cy: 45, rx: 3, ry: 2 },
      legRotations: [-5, 3, -3, 5],
      tailPath: "M 80 65 Q 98 48 94 32",
      tailStrokeWidth: SVG_CONSTANTS.STROKE_WIDTH.TAIL_SLIM,
    });

  const renderSlimFrame3 = () =>
    renderDogFrame("SLIM", {
      transform: SVG_CONSTANTS.TRANSFORMS.FRAME3,
      earRotation: { left: -5, right: 5 },
      eyeConfig: { r: 4, highlightR: 2, highlightOffset: { x: 0, y: -2 } },
      mouthPaths: ["M 60 42 Q 55 50 47 46", "M 60 42 Q 65 50 73 46"],
      tongueConfig: { cx: 60, cy: 47, rx: 4, ry: 3 },
      legRotations: [-10, 8, -8, 10],
      tailPath: "M 80 65 Q 105 42 100 22",
      tailStrokeWidth: SVG_CONSTANTS.STROKE_WIDTH.TAIL_SLIM,
    });

  // Render the appropriate SVG based on body type and frame
  if (bodyType === "fluffy") {
    if (frame === 1) return renderFluffyFrame1();
    if (frame === 2) return renderFluffyFrame2();
    if (frame === 3) return renderFluffyFrame3();
  } else if (bodyType === "slim") {
    if (frame === 1) return renderSlimFrame1();
    if (frame === 2) return renderSlimFrame2();
    if (frame === 3) return renderSlimFrame3();
  } else {
    // Default body type
    if (frame === 1) return renderDefaultFrame1();
    if (frame === 2) return renderDefaultFrame2();
    if (frame === 3) return renderDefaultFrame3();
  }

  return renderDefaultFrame1(); // Fallback
};

export default DogSvg;
