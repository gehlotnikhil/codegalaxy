import React, { useState } from "react";

const CodeDisplay: React.FC = () => {
  const [showFullCode, setShowFullCode] = useState(false);

  const handleToggle = () => {
    setShowFullCode(!showFullCode);
  };

  return (
    <div style={{ padding: "20px", backgroundColor: "#1e1e1e", color: "#d4d4d4", borderRadius: "8px" }}>
      <h3>Code Snippet</h3>
      {!showFullCode ? (
        <pre>
          <code>
            {`class Solution {
public:
    int missingNumber(vector<int>& arr) {
        // code here
    }
};`}
          </code>
        </pre>
      ) : (
        <pre>
          <code>
            {`#include <bits/stdc++.h>
using namespace std;

// Driver Code Starts
class Solution {
public:
    int missingNumber(vector<int>& arr) {
        // code here
    }
};
// Driver Code Ends`}
          </code>
        </pre>
      )}
      <button
        onClick={handleToggle}
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
        {showFullCode ? "Hide Full Code" : "Show Full Code"}
      </button>
    </div>
  );
};

export default CodeDisplay;
