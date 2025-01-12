import { Editor } from "@monaco-editor/react";
import { useEffect, useMemo, useState } from "react";

interface propType {
  height: string;
  defaultLanguage: string;
  readOnly: boolean;
  fontSize: number;
  CodeOfEditor: string;
  handleEditorChange: Function;
  renderValidationDecorations: "editable" | "on" | "off";
  style?: {};
}

function Code2(prop: propType) {
  const [showFullCode, setShowFullCode] = useState(false); // State for toggling full code display

  // Memoize options to avoid unnecessary re-renders
  const editorOptions = useMemo(
    () => ({
      readOnly: prop.readOnly,
      renderValidationDecorations: prop.renderValidationDecorations,
      fontSize: prop.fontSize,
    }),
    [prop.readOnly, prop.renderValidationDecorations, prop.fontSize]
  );

  useEffect(() => {
    console.log(prop); // Debug log for prop changes
  }, [prop]); // Log whenever props change

  // Partial and full code examples
  const partialCode = `class Solution {
public:
    int missingNumber(vector<int>& arr) {
        // code here
    }
};`;

  const fullCode = `#include <bits/stdc++.h>
using namespace std;

// Driver Code Starts
class Solution {
public:
    int missingNumber(vector<int>& arr) {
        // code here
    }
};
// Driver Code Ends`;

  return (
    <div style={{ height: "100vh", ...prop.style }}>
      <Editor
        height={prop.height}
        defaultLanguage={prop.defaultLanguage}
        value={showFullCode ? fullCode : partialCode} // Toggle between full and partial code
        onChange={(value) => prop.handleEditorChange(value)}
        theme="vs-dark"
        options={editorOptions} // Use memoized options
      />
      <button
        onClick={() => setShowFullCode(!showFullCode)} // Toggle button
        style={{
          marginTop: "10px",
          padding: "8px 16px",
          backgroundColor: "#007acc",
          color: "#fff",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        {showFullCode ? "Show Partial Code" : "Show Full Code"}
      </button>
    </div>
  );
}

export default Code2;
