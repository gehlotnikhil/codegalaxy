import React from "react";

interface OutputPanelProps {
  output: string;
  height:string;
  style?:{};
}

const OutputPanel: React.FC<OutputPanelProps> = (prop) => {
  return (
    <div className="" style={{...prop.style}}>
      <h3>Output:</h3>
      <p style={{fontSize:"1.5rem"}}>{prop.output || "No output yet"}</p>
    </div>
  );
};

export default OutputPanel;
