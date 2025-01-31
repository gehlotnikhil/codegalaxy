import React from "react";

interface ProgressCircleProps {
  easy: number;
  medium: number;
  hard: number;
  totalNumberOfQuestion:number;
}

const ProgressCircle2: React.FC<ProgressCircleProps> = ({ easy, medium, hard,totalNumberOfQuestion }) => {
  const radius = 50; // Radius of the circle
  const strokeWidth = 8; // Width of the stroke
  const normalizedRadius = radius - strokeWidth / 2;
  const circumference = 2 * Math.PI * normalizedRadius;

const total = easy+medium+hard
  // Calculate proportions
  const easyProportion = (easy / total) * circumference;
  const mediumProportion = (medium / total) * circumference;
  const hardProportion = (hard / total) * circumference;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <svg height={radius * 2} width={radius * 2}>
        {/* Easy Segment */}
        <circle
          stroke="#00cc88" // Green for Easy
          fill="transparent"
          strokeWidth={strokeWidth}
          strokeDasharray={`${easyProportion} ${circumference}`}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
          style={{ transform: "rotate(-90deg)", transformOrigin: "50% 50%" }}
        />
        {/* Medium Segment */}
        <circle
          stroke="#f9a825" // Yellow for Medium
          fill="transparent"
          strokeWidth={strokeWidth}
          strokeDasharray={`${mediumProportion} ${circumference}`}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
          style={{
            transform: `rotate(${(easyProportion / circumference) * 360 - 90}deg)`,
            transformOrigin: "50% 50%",
          }}
        />
        {/* Hard Segment */}
        <circle
          stroke="#d32f2f" // Red for Hard
          fill="transparent"
          strokeWidth={strokeWidth}
          strokeDasharray={`${hardProportion} ${circumference}`}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
          style={{
            transform: `rotate(${
              ((easyProportion + mediumProportion) / circumference) * 360 - 90
            }deg)`,
            transformOrigin: "50% 50%",
          }}
        />
      </svg>
      <div style={{ marginTop: "10px", textAlign: "center",fontWeight:"bold" }}>
        <h2>
          {easy+medium+hard}/{totalNumberOfQuestion} Solved
        </h2>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <span style={{ color: "#00cc88" }}>Easy: {easy}</span>
          <span style={{ color: "#f9a825" }}>Medium: {medium}</span>
          <span style={{ color: "#d32f2f" }}>Hard: {hard}</span>
        </div>
      </div>
    </div>
  );
};

export default ProgressCircle2;
