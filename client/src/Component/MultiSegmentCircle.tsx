import React from "react";

interface MultiSegmentCircleProps {
  easy: { count: number; total: number };
  medium: { count: number; total: number };
  hard: { count: number; total: number };
}

const MultiSegmentCircle: React.FC<MultiSegmentCircleProps> = ({
  easy,
  medium,
  hard,
}) => {
  const radius = 50; // Radius of the circle
  const strokeWidth = 8; // Width of the stroke
  const normalizedRadius = radius - strokeWidth / 2;
  const circumference = 2 * Math.PI * normalizedRadius;

  const easyProgress = (easy.count / easy.total) * 100;
  const mediumProgress = (medium.count / medium.total) * 100;
  const hardProgress = (hard.count / hard.total) * 100;

  // Calculate arc lengths for each segment
  const easyLength = (easyProgress / 100) * circumference;
  const mediumLength = (mediumProgress / 100) * circumference;
  const hardLength = (hardProgress / 100) * circumference;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <svg height={radius * 2} width={radius * 2}>
        {/* Easy Segment */}
        <circle
          stroke="#00cc88" // Green for easy
          fill="transparent"
          strokeWidth={strokeWidth}
          strokeDasharray={`${easyLength} ${circumference}`}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
          style={{ transform: "rotate(-90deg)", transformOrigin: "50% 50%" }}
        />
        {/* Medium Segment */}
        <circle
          stroke="#f9a825" // Yellow for medium
          fill="transparent"
          strokeWidth={strokeWidth}
          strokeDasharray={`${mediumLength} ${circumference}`}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
          style={{
            transform: `rotate(${(easyLength / circumference) * 360 - 90}deg)`,
            transformOrigin: "50% 50%",
          }}
        />
        {/* Hard Segment */}
        <circle
          stroke="#d32f2f" // Red for hard
          fill="transparent"
          strokeWidth={strokeWidth}
          strokeDasharray={`${hardLength} ${circumference}`}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
          style={{
            transform: `rotate(${
              ((easyLength + mediumLength) / circumference) * 360 - 90
            }deg)`,
            transformOrigin: "50% 50%",
          }}
        />
      </svg>
      <div style={{ marginTop: "10px", textAlign: "center" }}>
        <h2>
          {easy.count + medium.count + hard.count}/
          {easy.total + medium.total + hard.total}
        </h2>
        <p>Solved</p>
        <div style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
          <span style={{ color: "#00cc88" }}>Easy: {easy.count}/{easy.total}</span>
          <span style={{ color: "#f9a825" }}>Med: {medium.count}/{medium.total}</span>
          <span style={{ color: "#d32f2f" }}>Hard: {hard.count}/{hard.total}</span>
        </div>
      </div>
    </div>
  );
};

export default MultiSegmentCircle;
