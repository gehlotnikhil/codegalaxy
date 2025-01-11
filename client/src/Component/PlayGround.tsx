import { useContext, useEffect, useState } from "react";
import CodeEditor from "./CodeEditor";
import OutputPanel from "./Panel";
import MainContext from "../context/main";

function PlayGround() {
  const context = useContext(MainContext)
  const {handleCodeExecution} = context
  const [CodeValue, setCodeValue] = useState("");
  const [editableContent, setEditableContent] = useState("");
const [DisplayOutput, setDisplayOutput] = useState("")
useEffect(() => {
  console.log("displayoutput",DisplayOutput);
  
}, [DisplayOutput])

  const handleEditorChange = (value: string | undefined) => {
    setCodeValue(value || "");
  };
useEffect(() => {
  
}, [editableContent])

  const handleEditableChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditableContent(event.target.value);
  };

  useEffect(() => {
    console.log(CodeValue);
  }, [CodeValue]);

const [EditorLanguage, setEditorLanguage] = useState("c")
useEffect(() => {
  console.log("language-",EditorLanguage);
  
}, [EditorLanguage])

const handleRunCode = async()=>{
  const data = {
    code:CodeValue,
    language:EditorLanguage,
    testcases:[{
      input:editableContent,
      output:""
    }
    ]
  }
  const result = await handleCodeExecution(data)
  console.log("execute---",result);
  if(result.success === true){
    let output:string = result.output[0]
    let updatedOutput = output.replace("jdoodle","file")
    setDisplayOutput(updatedOutput)
  }
  
}

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        height: "100vh", // Full height layout
      }}
    >
      {/* Left Div */}
      <div
        style={{
          width: "60%",
          display: "flex",
          flexDirection: "column",
          boxSizing: "border-box",
          borderRight: "1px solid #ddd", // Divider between panes
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "8px",
            backgroundColor: "#f5f5f5",
            borderBottom: "1px solid #ddd",
          }}
        >
          <button
            style={{
              padding: "6px 12px",
              backgroundColor: "#007bff",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
            onClick={() => {handleRunCode()}}
          >
            Run Code
          </button>
          <select
          onChange={(value)=>setEditorLanguage(value.target.value)}
            style={{
              padding: "4px 8px",
              fontSize: "14px",
              border: "1px solid #ccc",
              borderRadius: "4px",
            }}
            defaultValue="c"
          >
            <option value="c">C</option>
            <option value="cpp">C++</option>
            <option value="java">Java</option>
            <option value="go">Go</option>
          </select>
        </div>

        {/* Code Editor */}
        <div style={{ flex: 1, overflow: "hidden" }}>
          <CodeEditor
          renderValidationDecorations={"on"}
            handleEditorChange={handleEditorChange}
            CodeOfEditor={CodeValue}
            height={"100%"}
            defaultLanguage={EditorLanguage}
            readOnly={false}
            fontSize={16}
          />
        </div>
      </div>

      {/* Right Div */}
      <div
        style={{
          width: "40%",
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#fff",
        }}
      >
        {/* First Nested Div */}
        <div
          style={{
            flex: 1,
            padding: "16px",
            color: "black",
            boxSizing: "border-box",
            borderBottom: "1px solid #ddd", // Divider between sections
          }}
        >
          <OutputPanel output={DisplayOutput===""?"Output will be displayed here":DisplayOutput} height="" />
        </div>

        {/* Second Nested Div (Editable) */}
        <div
          style={{
            flex: 1,
            padding: "",
            color: "black",
            boxSizing: "border-box",
          }}
        >
          {/* Editable Text Area */}
          <textarea
          placeholder="Provide Input"
            value={editableContent}
            onChange={handleEditableChange}
            style={{
              width: "100%",
              height: "100%",
              padding: "8px",
              fontSize: "1.5rem",
              boxSizing: "border-box",
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default PlayGround;
