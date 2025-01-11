import React from "react";

interface OutputPanelProps {
  output: string;
  height:string;
}

const OutputPanel: React.FC<OutputPanelProps> = (prop) => {
  return (
    <div className="" style={{}}>
      <h3>Output:</h3>
      <pre>{prop.output || "No output yet"}</pre>
    </div>
  );
};

export default OutputPanel;
