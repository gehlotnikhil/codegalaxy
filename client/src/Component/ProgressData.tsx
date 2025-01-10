import React from "react";

interface ProgressCircleProps {
  solved: number;
  total: number;
  attempting?: number;
}

const ProgressCircle: React.FC<ProgressCircleProps> = ({
  solved,
  total,
}) => {
  const radius = 50; // Radius of the circle
  const strokeWidth = 8; // Width of the stroke
  const normalizedRadius = radius - strokeWidth / 2;
  const circumference = 2 * Math.PI * normalizedRadius;

  const progress = (solved / total) * 100;
  const dashOffset = circumference - (progress / 100) * circumference;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <svg height={radius * 2} width={radius * 2}>
        <circle
          stroke="#d3d3d3"
          fill="transparent"
          strokeWidth={strokeWidth}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        <circle
          stroke="#00cc88" // Green color for progress
          fill="transparent"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
          style={{ transition: "stroke-dashoffset 0.5s ease" }}
        />
      </svg>
      <div style={{ marginTop: "10px", textAlign: "center" }}>
        <h2>
          {solved}/{total}
        </h2>
        <p>Solved</p>
      </div>
    </div>
  );
};


export default ProgressCircle;
