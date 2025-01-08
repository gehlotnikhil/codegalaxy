import  { useContext,useEffect } from "react";
import { Editor,loader } from "@monaco-editor/react";
import MainContext from "../context/main";


function CodeEditor() {
   const context = useContext(MainContext)
  const {CodeOfEditor, handleEditorChange} = context;
  useEffect(() => {
    loader.init().then((monaco) => {
      monaco.editor.defineTheme("customTheme", {
        base: "vs-dark", // Inherit dark theme
        inherit: true, // Inherit default vs-dark rules
        rules: [
          { token: "", background: "1E1E1E", foreground: "D4D4D4" },
          { token: "keyword", foreground: "C586C0" },
          { token: "string", foreground: "CE9178" },
          { token: "number", foreground: "B5CEA8" },
          { token: "comment", foreground: "6A9955" },
        ],
        colors: {
          "editor.background": "#1E1E1E", // Background color
          "editor.foreground": "#D4D4D4", // Text color
          "editorLineNumber.foreground": "#858585", // Line numbers
          "editorCursor.foreground": "#FFFFFF", // Cursor color
        },
      });
    });
  }, []);
   

  return (
    <div style={{ height: "60vh" }}  >
      <Editor
        height="90%"
        defaultLanguage="typescript"
        value={CodeOfEditor}
        onChange={(value) =>  handleEditorChange(value)}
        theme="vs-dark"
        options={{
          readOnly: true, // Enable read-only mode
          renderValidationDecorations: "off", // Hide error indicators
          fontSize: 20, // Increase font size (default is 12)

        }}
      />
    </div>
  );
}

export default CodeEditor;
