import React, { useState } from "react";
import CodeEditor from "./Code";
import OutputPanel from "./Panel";

const Demo2: React.FC = () => {
  const [code, setCode] = useState(`int main() {\n  std::cout << "Hello World!\\n";\n}`);
  const [output, setOutput] = useState("");

  const runCode = () => {
    // Mocked output logic
    setOutput("Hello World!");
  };

  return (
    <div className="app-container">
      {/* Header */}
      <div className="header">
        <button className="run-button" onClick={runCode}>
          Run Code
        </button>
        <input type="text" value="Untitled" className="title-input" readOnly />
        <select className="language-dropdown" defaultValue="C++">
          <option value="C++">C++</option>
          <option value="Python">Python</option>
          <option value="JavaScript">JavaScript</option>
        </select>
      </div>

      {/* Main Content */}
      <div className="main-container">
        {/* Code Editor */}
        <CodeEditor
          value={code}
          language="cpp"
          onChange={(value) => setCode(value || "")}
        />

        {/* Output Panel */}
        {/* <OutputPanel output={output} /> */}
      </div>
    </div>
  );
};

export default Demo2;
