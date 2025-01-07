import  { useState } from "react";
import { Editor } from "@monaco-editor/react";

interface CodeEditorProps {
  className?: string;
}

function CodeEditor() {
    const [code, setCode] = useState(`import React, { useState } from "react";
import * as yup from "yup";

function Admin() {
  interface InOutTestCase {
    input: string;
    output: string;
  }

  return <div>Admin Component</div>;
}`);

  const handleEditorChange = (value: string | undefined) => {
    setCode(value || "");
  };

  return (
    <div style={{ height: "90vh" }} >
      <Editor
        height="100%"
        defaultLanguage="typescript"
        value={code}
        onChange={handleEditorChange}
        theme="vs-dark"
      />
    </div>
  );
}

export default CodeEditor;
