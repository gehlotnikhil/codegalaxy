import { Editor } from "@monaco-editor/react";
import { useEffect, useMemo } from "react";

interface propType {
  height: string;
  defaultLanguage: string;
  readOnly: boolean;
  fontSize: number;
  CodeOfEditor: string;
  handleEditorChange: Function;
  renderValidationDecorations: "editable" | "on" | "off";
}

function CodeEditor(prop: propType) {
  // Memoize options to avoid unnecessary re-renders
  const editorOptions = useMemo(() => ({
    readOnly: prop.readOnly,
    renderValidationDecorations: prop.renderValidationDecorations,
    fontSize: prop.fontSize,
  }), [prop.readOnly, prop.renderValidationDecorations, prop.fontSize]);

  useEffect(() => {
    console.log(prop); // Debug log for prop changes
  }, [prop]); // Log whenever props change

  return (
    <div style={{ height: "100vh" }}>
      <Editor
        height={prop.height}
        defaultLanguage={prop.defaultLanguage}
        value={prop.CodeOfEditor}
        onChange={(value) => prop.handleEditorChange(value)}
        theme="vs-dark"
        options={editorOptions} // Use memoized options
      />
    </div>
  );
}

export default CodeEditor;
