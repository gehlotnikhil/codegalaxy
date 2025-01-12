import React, { useContext, useEffect, useState } from "react";
import CodeEditor from "./CodeEditor";
import TestStatus from "./TestBox";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbsUp, faThumbsDown } from "@fortawesome/free-solid-svg-icons";
import { faTag, faBuilding } from "@fortawesome/free-solid-svg-icons";
import TopicTag from "./TopicTag";
import MainContext from "../context/main";
import { toast } from "react-toastify";

const ProblemPage: React.FC = () => {
  const context = useContext(MainContext);
  const { handleCodeExecution } = context;
  const Question = {
    id: "6783b0d81ffece704ef085b3",
    problemNo: 1,
    problemName: "Add Two Numbers",
    description: "This is a simple problem to add two numbers.",
    companies: ["Apple", "Google"],
    like: 121,
    dislike: 44,
    constraint: ["return only integer"],
    topic: ["Array", "String"],
    accepted: 324,
    submission: 551,
    status: "UNSOLVED",
    category: "ALGORITHMS",
    sampleInputOutput: [
      {
        input: "45 7",
        output: "54",
      },
      {
        input: "559 100",
        output: "659",
      },
    ],
    testcases: [
      {
        input: "23 54",
        output: "77",
      },
      // {
      //   input: "99 66 ",
      //   output: "165",
      // },
      // {
      //   input: "100 200 ",
      //   output: "300",
      // },
    ],
    aboveCodeTemplate: {
      go: `package main

import (
	"fmt"
)

`,
      java: `import java.util.Scanner;

public class Main {
`,
      cpp: `#include <iostream>
using namespace std;

`,
      c: `#include <stdio.h>

`,
    },
    middleCode: {
      go: `func addTwoNumber(a int, b int) int {
	// Logic
}`,
      java: `public static int addTwoNumber(int a, int b) {
   // Logic
}`,
      cpp: `int addTwoNumber(int a,int b){
   //Logic
}`,
      c: `int addTwoNumber(int a, int b) {
    //Logic
}`,
    },
    belowCodeTemplate: {
      go: `
func main() {
	var a, b int
	fmt.Scan(&a)
	fmt.Scan(&b)
	fmt.Println(addTwoNumber(a, b))
}
`,
      java: `    
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int a = scanner.nextInt();
        int b = scanner.nextInt();
        System.out.println(addTwoNumber(a, b));
        scanner.close();
    }
}
`,
      cpp: `
    int main() {
   int a,b;
   cin>>a;
   cin>>b;
   cout<<addTwoNumber(a,b);
   return 0;
  }`,
      c: `
  int main() {
    int a, b;
    scanf("%d", &a);
    scanf("%d", &b);
    printf("%d", addTwoNumber(a, b));
    return 0;
}`,
    },
  };
  type Language = "go" | "java" | "cpp" | "c";
  const [SelectedLanguage, setSelectedLanguage] = useState<Language>("c");
  const topics = Question.topic;
  const companies = Question.companies;
  const [code, setCode] = useState(Question.middleCode.c);
  interface TestResult {
    isSuccess?: "pass" | "failed" | "pending";
  }
  const [ResultOfTest, setResultOfTest] = useState<TestResult[]>([]);
  const [QuestionStatus, setQuestionStatus] = useState(() => {
    return Question.status === "SOLVED" ? true : false;
  });
  const constraints = Question.constraint;
  // State to manage visibility
  const [showQuestionInfos, setShowQuestionInfos] = useState({
    QuestionInfo1: false,
    QuestionInfo2: false,
  });
  const sampleTestCases = Question.sampleInputOutput;
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
      content: (
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
      content: (
        <>
          {companies.map((topic) => (
            <TopicTag key={topic} label={topic} />
          ))}
        </>
      ),
    },
  ];

  useEffect(() => {
    console.log(QuestionStatus);
  }, [QuestionStatus]);
  useEffect(() => {
    console.log(SelectedLanguage);
    setResultOfTest([]);
    setCode(Question.middleCode[SelectedLanguage]);
  }, [SelectedLanguage]);
  useEffect(() => {
    console.log(code);
  }, [code]);
  useEffect(() => {
    console.log(ResultOfTest);
  }, [ResultOfTest]);

  const handleCodeChange = (e: string) => {
    setCode(e);
  };
  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedLanguage(e.target.value as Language);
  };
  const handleRunCode = async () => {
    setResultOfTest(
      Question.testcases.map(() => {
        return { isSuccess: "pending" };
      })
    );

    const data = {
      code:
        Question.aboveCodeTemplate[SelectedLanguage] +
        code +
        Question.belowCodeTemplate[SelectedLanguage],
      language: SelectedLanguage,
      testcases: Question.testcases,
    };
    try {
    console.log("data send--", data);
    let jsondata = await handleCodeExecution(data);
    console.log(jsondata);
    let finalMsg = false;
    if (jsondata.success) {
      finalMsg = true;
      let finalStatus = jsondata.result.map((value: any) => {
        if (value === true) {
          return { isSuccess: "pass" };
        } else {
          finalMsg = false;
          return { isSuccess: "failed" };
        }
      });
      setResultOfTest(finalStatus);
      if (finalMsg === true) {
        setQuestionStatus(true);
        toast.success("Passed");
      } else toast.error("Failed");
    } else {
      toast.error("Failed");
      setResultOfTest(
        Question.testcases.map(() => {
          return { isSuccess: "failed" };
        })
      );
    }
  } catch (error) {
    console.log(error);
    setResultOfTest(
      Question.testcases.map(() => {
        return { isSuccess: "failed" };
      })
    );
  }
  };
  const toggleQuestionInfo = (
    QuestionInfoKey: keyof typeof showQuestionInfos
  ) => {
    setShowQuestionInfos((prevState) => ({
      ...prevState,
      [QuestionInfoKey]: !prevState[QuestionInfoKey],
    }));
  };

  return (
    <>
      <div style={styles.container}>
        {/* Left Section */}
        <div style={{ ...styles.leftSection, minWidth: "45%" }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <h1 style={styles.title}>
              {Question.problemNo}. {Question.problemName}
            </h1>
            <div
              style={styles.status}
              className={`d-${QuestionStatus ? "inline-block" : "none"}`}
            >
              <span style={styles.solvedText}>Solved</span>
              <span style={styles.checkmark}>✅</span>
            </div>
          </div>
          <p style={styles.description}>{Question.description}</p>
          <div>
            {/* Test Cases */}
            {sampleTestCases.map((testCase, index) => (
              <div key={index} style={styles.testCase}>
                <p>
                  <strong>Test case {index + 1}</strong>
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
              <span className="ms-2 fw-bold">{Question.accepted}</span>
            </div>
            <div>
              <span>Submissions</span>
              <span className="ms-2 fw-bold">{Question.submission}</span>
            </div>
            <div>
              <span>Acceptance Rate</span>
              <span className="ms-2 fw-bold">
                {((Question.accepted / Question.submission) * 100).toFixed(2)}%
              </span>
            </div>
          </div>
          <hr />

          <div style={{}}>
            <h5 style={{}}>Constraints:</h5>
            <ul style={styles2.list}>
              {constraints.map((constraint, index) => (
                <li key={index} style={styles2.item}>
                  <span style={styles2.box}>{constraint}</span>
                </li>
              ))}
            </ul>
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
                    <span>
                      {showQuestionInfos[QuestionInfo.key] ? "▲" : "▼"}
                    </span>
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
            <select
              value={SelectedLanguage}
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
            defaultLanguage={SelectedLanguage}
            readOnly={false}
            fontSize={16}
            style={styles.codeEditor}
          />
          <div style={styles.actionButtons}>
            <button onClick={() => handleRunCode()} style={styles.submitButton}>
              Submit
            </button>
          </div>
          <TestStatus tests={ResultOfTest} />
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
  status: {
    display: "flex",
    alignItems: "center",
    gap: "5px",
  },
  solvedText: {
    fontSize: "14px",
  },
  checkmark: {
    fontSize: "16px",
  },
};
const styles2 = {
  list: {
    listStyleType: "disc",
    paddingLeft: "20px",
  },
  item: {
    marginBottom: "10px",
  },
  box: {
    display: "inline-block",
    padding: "5px 10px",
    borderRadius: "4px",
    fontSize: "14px",
  },
};

export default ProblemPage;
