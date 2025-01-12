import React, { useEffect, useState } from "react";
import CodeEditor from "./CodeEditor";
import TestStatus from "./TestBox";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbsUp, faThumbsDown } from "@fortawesome/free-solid-svg-icons";
import { faTag, faBuilding } from "@fortawesome/free-solid-svg-icons";
import TopicTag from "./TopicTag";

const ProblemPage: React.FC = () => {
  const topics = ["Array", "Hash Table"];
  const companies = ["Google", "Amazon"];
  const [showFullCode, setShowFullCode] = useState(false); // State for toggling full code display

  const [code, setCode] = useState("// Implementation goes here\n");
  const [language, setLanguage] = useState("c");

  const testCases = [
    { id: 1, input: "1, 2", output: "3" },
    { id: 2, input: "5, 7", output: "12" },
    { id: 3, input: "5, 7", output: "12" },
    { id: 4, input: "5, 7", output: "12" },
  ];

  useEffect(() => {
    console.log(showFullCode);
  }, [showFullCode, language]);
  const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCode(e.target.value);
  };

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLanguage(e.target.value);
  };

  const handleSubmit = () => {
    alert("Code submitted!");
  };

  // State to manage visibility
  const [showQuestionInfos, setShowQuestionInfos] = useState({
    QuestionInfo1: false,
    QuestionInfo2: false,
  });

  const toggleQuestionInfo = (QuestionInfoKey: keyof typeof showQuestionInfos) => {
    setShowQuestionInfos((prevState) => ({
      ...prevState,
      [QuestionInfoKey]: !prevState[QuestionInfoKey],
    }));
  };

  const QuestionInfos = [
    {
      key: "QuestionInfo1" as "QuestionInfo1",
      title: (
        <>
          <pre style={{ fontSize: "1rem" }}>
            {" "}
            <FontAwesomeIcon color="orange" icon={faTag} size="1x" /> Topic
          </pre>
        </>
      ),
      content:(
        <>
        {topics.map((topic) => (
          <TopicTag key={topic} label={topic} />
        ))}
        </>
      ),
    },
    {
      key: "QuestionInfo2" as "QuestionInfo2",
      title: (
        <>
          <pre style={{ fontSize: "1rem" }}>
            {" "}
            <FontAwesomeIcon color="blue" icon={faBuilding} size="1x" />{" "}
            Companies
          </pre>
        </>
      ),
      content:(
        <>
        {companies.map((topic) => (
          <TopicTag key={topic} label={topic} />
        ))}
        </>
      ),
        },
  ];

  return (
    <>
      <div style={styles.container}>
        {/* Left Section */}
        <div style={{ ...styles.leftSection, minWidth: "45%" }}>
          <h1 style={styles.title}>1. Two sum</h1>
          <p style={styles.description}>
            Find the sum of two given elements. Both the numbers will always be
            0 or positive.
          </p>
          <div>
            {/* Test Cases */}
            {testCases.map((testCase) => (
              <div key={testCase.id} style={styles.testCase}>
                <p>
                  <strong>Test case {testCase.id}</strong>
                </p>
                <div style={styles.testIO}>
                  <p style={styles.ioTitle}>Input</p>
                  <div style={styles.ioBox}>{testCase.input}</div>
                </div>
                <div style={styles.testIO}>
                  <p style={styles.ioTitle}>Output</p>
                  <div style={styles.ioBox}>{testCase.output}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="d-flex justify-content-between align-items-center ">
            <div>
              <span>Accepted</span>
              <span className="ms-2 fw-bold">15.7M</span>
            </div>
            <div>
              <span>Submissions</span>
              <span className="ms-2 fw-bold">28.8M</span>
            </div>
            <div>
              <span>Acceptance Rate</span>
              <span className="ms-2 fw-bold">54.6%</span>
            </div>
          </div>
          
          <div className="mb-4">
            <div>
              {QuestionInfos.map((QuestionInfo) => (
                <div className="mb-3" key={QuestionInfo.key}>
                  <hr />
                  <div
                    className="cursor-pointer d-flex justify-content-between align-items-center"
                    onClick={() => toggleQuestionInfo(QuestionInfo.key)}
                  >
                    <span>{QuestionInfo.title}</span>
                    <span>{showQuestionInfos[QuestionInfo.key] ? "▲" : "▼"}</span>
                  </div>
                  {showQuestionInfos[QuestionInfo.key] && (
                    <p className="mt-2">{QuestionInfo.content}</p>
                  )}
                </div>
              ))}
            </div>
            {/* Footer */}
            <div className="d-flex justify-content-between border-top pt-3">
              <div>
                <span className="me-3">
                  © 2025 CodeGalaxy All rights reserved
                </span>
              </div>
              <div className="text-muted d-flex align-items-center">
                {/* Thumbs Up */}
                <div
                  className="d-flex align-items-center me-3"
                  onClick={() => {}}
                  style={{ cursor: "pointer" }}
                >
                  <FontAwesomeIcon icon={faThumbsUp} className="me-1" />
                  <span>767</span>
                </div>
                {/* Thumbs Down */}
                <div
                  className="d-flex align-items-center"
                  onClick={() => {}}
                  style={{ cursor: "pointer" }}
                >
                  <FontAwesomeIcon icon={faThumbsDown} className="me-1" />
                  <span>99</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div style={{ ...styles.rightSection, minWidth: "55%" }}>
          <div style={styles.languageHeader}>
            <button
              onClick={() => {
                setShowFullCode(!showFullCode);
              }} // Toggle button
              style={{
                padding: "8px 16px",
                backgroundColor: "#007acc",
                color: "#fff",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                marginRight: "1rem",
              }}
            >
              {showFullCode ? "Show Partial Code" : "Show Full Code"}
            </button>
            <select
              value={language}
              onChange={handleLanguageChange}
              style={styles.languageDropdown}
            >
              <option value="c">C</option>
              <option value="cpp">C++</option>
              <option value="java">Java</option>
              <option value="go">Go</option>
            </select>
          </div>
          <CodeEditor
            renderValidationDecorations={"on"}
            handleEditorChange={handleCodeChange}
            CodeOfEditor={code}
            height={"100%"}
            defaultLanguage={"typescript"}
            readOnly={false}
            fontSize={16}
            style={styles.codeEditor}
          />
          <div style={styles.actionButtons}>
            <button onClick={handleSubmit} style={styles.submitButton}>
              Submit
            </button>
            <button style={styles.submissionsButton}>Submissions</button>
          </div>
          <TestStatus />
        </div>
      </div>
    </>
  );
};

// Styles
const styles = {
  container: {
    display: "flex",
    flexDirection: "row" as const,
    gap: "20px",
    padding: "20px",
    fontFamily: "Arial, sans-serif",
    // backgroundColor: "#f9f9f9",
    color: "#333",
    width: "100%",
    height: "100vh",
  },
  leftSection: {
    flex: 1,
    display: "flex",
    flexDirection: "column" as const,
    gap: "20px",
    padding: "20px",
    backgroundColor: "#ffffff",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    overflowY: "scroll" as "scroll",
  },
  title: {
    fontSize: "24px",
    fontWeight: "bold",
  },
  description: {
    fontSize: "16px",
    color: "#666",
  },
  testCase: {
    marginBottom: "10px",
  },
  testIO: {
    marginBottom: "10px",
  },
  ioTitle: {
    fontWeight: "bold",
    fontSize: "14px",
    marginBottom: "4px",
  },
  ioBox: {
    padding: "10px",
    backgroundColor: "#2d2d2d",
    color: "#fff",
    borderRadius: "4px",
    fontSize: "14px",
    fontFamily: "monospace",
  },
  rightSection: {
    flex: 2,
    display: "flex",
    flexDirection: "column" as const,
    padding: "20px",
    backgroundColor: "#ffffff",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    overflowY: "scroll" as "scroll",
  },
  languageHeader: {
    marginBottom: "10px",
    display: "flex",
    justifyContent: "flex-end",
  },
  languageDropdown: {
    padding: "8px",
    borderRadius: "4px",
    border: "1px solid #ddd",
    backgroundColor: "#ffffff",
  },
  codeEditor: {
    // width: "100%",
    height: "65%",
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    fontFamily: "monospace",
    fontSize: "14px",
    backgroundColor: "#1e1e1e",
    color: "#fff",
    resize: "none" as const,
  },
  actionButtons: {
    display: "flex",
    gap: "10px",
    marginTop: "10px",
    justifyContent: "flex-end",
  },
  submitButton: {
    padding: "10px 20px",
    backgroundColor: "#007bff",
    color: "#ffffff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontWeight: "bold",
  },
  submissionsButton: {
    padding: "10px 20px",
    backgroundColor: "#6c757d",
    color: "#ffffff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontWeight: "bold",
  },
};

export default ProblemPage;
