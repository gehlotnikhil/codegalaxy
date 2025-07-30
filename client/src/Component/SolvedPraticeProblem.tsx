import React, { useContext, useEffect, useState } from "react";
import CodeEditor from "./CodeEditor";
import TestStatus from "./TestBox";
import spinner from '../assets/tube-spinner.svg';
import MainContext from "../context/main";
import { toast } from "react-toastify";
import { useLocation, useNavigate, useParams } from "react-router";
import { useSelector } from "react-redux";
import { RootStateType } from "../store";
import { useDispatch } from "react-redux";
import { setUserDetail } from "../store/slice/UserDetailSlice";

import { apiFetch } from '../utils/api';

const SolvedPraticeProblem: React.FC = () => {
    const dispatch = useDispatch();
  
    const locationHook = useLocation()
  interface MainQuestionType {
    id?: string;
    problemName?: string;
    description?: string;
    language?:"c"|"cpp"|"java"|"go";
    constraint?: string[];
    status?: "SOLVED" | "UNSOLVED";
    sampleInputOutput?: { input: string; output: string }[];
    testcases?: { input: string; output: string }[];
    aboveCodeTemplate?: { go: string; java: string; cpp: string; c: string };
    middleCode?: { go: string; java: string; cpp: string; c: string };
    belowCodeTemplate?: { go: string; java: string; cpp: string; c: string };
  }
  const userDetail = useSelector((state:RootStateType)=>state.userDetail)
  const [MainQuestion, setMainQuestion] = useState<MainQuestionType>({});
  const context = useContext(MainContext);
  const { SERVER_URL } = context;
  const param = useParams<{ problemid: string }>();
  const navigate = useNavigate();
  interface praticeCourseDetailType{
    c : CourseDetail
    cpp: CourseDetail
    java: CourseDetail
    go :CourseDetail
  }
    
  interface CourseDetail{
    participated :boolean 
    review : 0|1 | 2 | 3 | 4| 5 
    solvedProblemDetails :String[]
  }
  const loadMainQuestion =  async(id: string) => {
    
    const response = await apiFetch(
      `/api/problemset/getspecificpraticeproblem?id=${id}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token: userDetail.token }),
      }
    );
    const jsondata = await response;
    console.log("jsondata--------------------", jsondata);
    if (jsondata.success) {
    
      console.log(jsondata.result);
      setMainQuestion(jsondata.result as MainQuestionType);
      setCode(jsondata.result.middleCode[SelectedLanguage]);
      setQuestionStatus(jsondata.result.status === "SOLVED");
    } else {
      navigate("/error");
    }
  };
  useEffect(() => {
    console.log(typeof param.problemid, "param", param.problemid);
    loadMainQuestion(param.problemid as string);
    setSelectedLanguage(MainQuestion.language || "c");
    ((locationHook.pathname).replace("/pratice/","")).substring(0, (((locationHook.pathname).replace("/pratice/","")).indexOf("/")))
  }, []);
  const [SelectedLanguage, setSelectedLanguage] = useState<Language>("c");

  useEffect(() => {
    
  console.log(MainQuestion);
  setSelectedLanguage(MainQuestion.language || "c")
  
  }, [MainQuestion])
      const [spinnerStatus, setspinnerStatus] = useState<boolean>(false)
      useEffect(() => {
        console.log(spinnerStatus);
      }, [spinnerStatus])
  
  

  const { handleCodeExecution } = context;
  type Language = "go" | "java" | "cpp" | "c";

  
  const [code, setCode] = useState(
    MainQuestion.middleCode ? MainQuestion.middleCode.c : ""
  );
  interface TestResult {
    isSuccess?: "pass" | "failed" | "pending";
  }
  const [ResultOfTest, setResultOfTest] = useState<TestResult[]>([]);
  const [QuestionStatus, setQuestionStatus] = useState(false);
  const constraints = MainQuestion.constraint;
  // State to manage visibility

  const sampleTestCases = MainQuestion.sampleInputOutput;

  useEffect(() => {
    console.log(QuestionStatus);
  }, [QuestionStatus]);
  useEffect(() => {
    console.log(SelectedLanguage);
    setResultOfTest([]);
    setCode(
      MainQuestion.middleCode ? MainQuestion.middleCode[SelectedLanguage] : ""
    );
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

 const updateSubmissionStatus = async (status: boolean) => {
    try {
      
      let praticeCourseDetail:{
        c:{participated:boolean,review:number,solvedProblemDetails:string[]},
        java:{participated:boolean,review:number,solvedProblemDetails:string[]},
        cpp:{participated:boolean,review:number,solvedProblemDetails:string[]},
        go:{participated:boolean,review:number,solvedProblemDetails:string[]},
      } =  JSON.parse(JSON.stringify(userDetail.praticeCourseDetail))
      console.log("-q-q--q",praticeCourseDetail);
      
      console.log("-q-q--q",praticeCourseDetail);
      
      console.log("asqw------",praticeCourseDetail[MainQuestion.language as keyof praticeCourseDetailType].solvedProblemDetails,"--",typeof praticeCourseDetail[MainQuestion.language as keyof praticeCourseDetailType].solvedProblemDetails);
      console.log(praticeCourseDetail[MainQuestion.language as keyof praticeCourseDetailType].solvedProblemDetails.includes(MainQuestion.id as string));
      
      if (status && !praticeCourseDetail[MainQuestion.language as keyof praticeCourseDetailType].solvedProblemDetails.includes(MainQuestion.id as string)) {
        praticeCourseDetail[MainQuestion.language as keyof praticeCourseDetailType].solvedProblemDetails = [...praticeCourseDetail[MainQuestion.language as keyof praticeCourseDetailType].solvedProblemDetails,(MainQuestion?.id as string )]
      }
      console.log("aqswdefkkkkk------",praticeCourseDetail[MainQuestion.language as keyof praticeCourseDetailType].solvedProblemDetails,"--",typeof praticeCourseDetail[MainQuestion.language as keyof praticeCourseDetailType].solvedProblemDetails);
      const response = await apiFetch(`/api/user/update/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: userDetail.token,
          praticeCourseDetail,
        }),
      });

      const jsondata = await response;
      console.log("updatedUser------", jsondata);

      if (jsondata.success) {
        // Update local state with correct values
        dispatch(setUserDetail({praticeCourseDetail}))
        console.log("get out - - - - - - - -");
      }
      console.log("get out - - - - - - - - bye");
      
    } catch (error) {
      console.error("Error updating submission status:", error);
    }
  };

  function getDayOfYear() {
    const date = new Date();
    const start = new Date(date.getFullYear(), 0, 0);
    const diff = (date as any) - (start as any);
    const oneDay = 1000 * 60 * 60 * 24;
    return Math.floor(diff / oneDay);
  }

  const handleRunCode = async () => {
    setspinnerStatus(true)
    const testcases = MainQuestion.testcases ? MainQuestion.testcases : [];
    const aboveCodeTemplate = MainQuestion.aboveCodeTemplate
      ? MainQuestion.aboveCodeTemplate[SelectedLanguage]
      : "";
    const belowCodeTemplate = MainQuestion.belowCodeTemplate
      ? MainQuestion.belowCodeTemplate[SelectedLanguage]
      : "";
    setResultOfTest(
      testcases.map(() => {
        return { isSuccess: "pending" };
      })
    );

    const data = {
      code: aboveCodeTemplate + code + belowCodeTemplate,
      language: SelectedLanguage,
      testcases: MainQuestion.testcases,
    };
    try {
      console.log("data send--", data);
      let jsondata = await handleCodeExecution(data);
      console.log(jsondata);


      
            if (!userDetail.activeDays.includes(getDayOfYear())) {
              const updateresult = await apiFetch(`/api/user/update/`, {
                method: "PUT",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  token: userDetail.token,
                  activeDays: [...userDetail.activeDays, getDayOfYear()],
                }),
              });
              const jsondata2 = await updateresult;
              console.log("ppppppp-----", jsondata2);
      
              if (jsondata2.success) {
                dispatch(
                  setUserDetail({
                    activeDays: [...userDetail.activeDays, getDayOfYear()],
                  })
                );
              }
            }
      



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
          updateSubmissionStatus(true);
        } else{ toast.error("Failed");
          updateSubmissionStatus(false);

        }
      } else {
        toast.error("Failed");
        setResultOfTest(
          testcases.map(() => {
            return { isSuccess: "failed" };
          })
        );
      }
    } catch (error) {
      console.log(error);
      setResultOfTest(
        testcases.map(() => {
          return { isSuccess: "failed" };
        })
      );
    }
    setspinnerStatus(false)

  };


  return (
    <>
      <div style={styles.container}>
        {/* Left Section */}
        <div style={{ ...styles.leftSection, minWidth: "45%" }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <h1 style={styles.title}>
               {MainQuestion.problemName}
            </h1> 
            <div
              style={styles.status}
              className={`d-${QuestionStatus ? "inline-block" : "none"}`}
            >
              <span style={styles.solvedText}>Solved</span>
              <span style={styles.checkmark}>✅</span>
            </div>
          </div>
          <pre style={styles.description}>{MainQuestion.description}</pre>
          <div>
            {/* Test Cases */}
            {sampleTestCases &&
              sampleTestCases.map((testCase, index) => (
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
          <hr />

          <div style={{}}>
            <h5 style={{}}>Constraints:</h5>
            <ul style={styles2.list}>
              {constraints &&
                constraints.map((constraint, index) => (
                  <li key={index} style={styles2.item}>
                    <span style={styles2.box}>{constraint}</span>
                  </li>
                ))}
            </ul>
          </div>

          <div className="mb-4">
            {/* Footer */}
            <div className="d-flex justify-content-between border-top pt-3">
              <div>
                <span className="me-3">
                  © 2025 CodeGalaxy All rights reserved
                </span>
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
              <option value={`${SelectedLanguage}`}>{SelectedLanguage.toUpperCase()}</option>
              
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
          <button  disabled={spinnerStatus}   onClick={() => handleRunCode()} style={styles.submitButton}>
              Submit <img className={`d-${spinnerStatus?"inline":"none"}`} src={spinner} height={"22px"} width={"22px"}/>
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
export default SolvedPraticeProblem;
