// LoadingComponent.tsx
import React from "react";

const LoadingComponent: React.FC = () => {
  return (
    <div className="loading-container">
      <div className="ninja-animation">
        <div className="ninja"></div>
      </div>
      <div className="loading-text">CodeGalaxy</div>
    </div>
  );
};


export default LoadingComponent;
