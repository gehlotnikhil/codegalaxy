import React, { useContext, useEffect, useState } from "react";
import CodeEditor from "./CodeEditor";
import TestStatus from "./TestBox";
import spinner from "../assets/tube-spinner.svg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbsUp, faThumbsDown } from "@fortawesome/free-solid-svg-icons";
import { faTag, faBuilding } from "@fortawesome/free-solid-svg-icons";
import TopicTag from "./TopicTag";
import MainContext from "../context/main";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router";
import { useSelector } from "react-redux";
import { RootStateType } from "../store";
import { useDispatch } from "react-redux";
import { setUserDetail } from "../store/slice/UserDetailSlice";
const ProblemPage: React.FC = () => {
  const dispatch = useDispatch();
  const userDetail = useSelector((state: RootStateType) => state.userDetail);
  interface MainQuestionType {
    id?: string;
    problemNo?: number;
    problemName?: string;
    description?: string;
    companies?: string[];
    constraint?: string[];
    Details?: {
      like: string[];
      dislike: string[];
    };
    topic?: (
      | "ARRAY"
      | "STRING"
      | "BINARYSEARCH"
      | "DYNAMICPROGRAMMING"
      | "GRAPH"
    )[];
    accepted?: number;
    submission?: number;
    status?: "SOLVED" | "UNSOLVED";
    category?: "AI" | "ALGORITHMS" | "CONCURRENCY";
    sampleInputOutput?: { input: string; output: string }[];
    testcases?: { input: string; output: string }[];
    aboveCodeTemplate?: { go: string; java: string; cpp: string; c: string };
    middleCode?: { go: string; java: string; cpp: string; c: string };
    correctMiddleCode?: { go: string; java: string; cpp: string; c: string };
    belowCodeTemplate?: { go: string; java: string; cpp: string; c: string };
  }
  const [MainQuestion, setMainQuestion] = useState<MainQuestionType>({});
  useEffect(() => {
    console.log("---", MainQuestion);
    setLikeChoice(() => {
      let result = MainQuestion.Details?.like.includes(userDetail.id);
      if (result) return 1;
      else {
        if (MainQuestion.Details?.dislike.includes(userDetail.id)) return -1;
        else return 0;
      }
    });
  }, [MainQuestion]);

  const context = useContext(MainContext);
  const { SERVER_URL } = context;
  const param = useParams<{ problemid: string }>();
  const [showCustomTestCase, setshowCustomTestCase] = useState(false);
  useEffect(() => {
    console.log(showCustomTestCase);
  }, [showCustomTestCase]);

  const [CustomRunCodeSpinnerStatus, setCustomRunCodeSpinnerStatus] =
    useState(false);
  useEffect(() => {
    console.log(CustomRunCodeSpinnerStatus);
  }, [CustomRunCodeSpinnerStatus]);

  const navigate = useNavigate();
  const [LikeChoice, setLikeChoice] = useState(0);
  useEffect(() => {
    console.log("LikeChoice---", LikeChoice);
    console.log(MainQuestion, "-----", userDetail.id);
    console.log(
      MainQuestion.Details?.like.includes(userDetail.id),
      " ",
      MainQuestion.Details?.dislike.includes(userDetail.id)
    );
  }, [LikeChoice]);
  const loadMainQuestion = async (id: string) => {
    const response = await fetch(
      `${SERVER_URL}/api/problemset/getspecificproblem?id=${id}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token: userDetail.token }),
      }
    );
    const jsondata = await response.json();
    console.log("jsondata--------------------", jsondata);
    if (jsondata.success) {
      console.log(jsondata.result);
      setMainQuestion(jsondata.result);
      setCode(jsondata.result.middleCode[SelectedLanguage]);
      setQuestionStatus(jsondata.result.status === "SOLVED");
    } else {
      navigate("/error");
    }
  };
  useEffect(() => {
    console.log(typeof param.problemid, "param", param.problemid);
    loadMainQuestion(param.problemid as string);
  }, []);

  const handleLikeChoice = async (value: number) => {
    if (!MainQuestion || !userDetail) return;

    let updatedLike = [...(MainQuestion.Details?.like || [])];
    let updatedDislike = [...(MainQuestion.Details?.dislike || [])];

    if (LikeChoice === value) {
      // If already liked/disliked, remove user ID from respective array
      updatedLike = updatedLike.filter((id) => id !== userDetail.id);
      updatedDislike = updatedDislike.filter((id) => id !== userDetail.id);
      setLikeChoice(0);
    } else if (LikeChoice === -1 && value === 1) {
      // If disliked and now liking
      updatedDislike = updatedDislike.filter((id) => id !== userDetail.id);
      updatedLike.push(userDetail.id);
      setLikeChoice(1);
    } else if (LikeChoice === 1 && value === -1) {
      // If liked and now disliking
      updatedLike = updatedLike.filter((id) => id !== userDetail.id);
      updatedDislike.push(userDetail.id);
      setLikeChoice(-1);
    } else {
      // If first time liking/disliking
      if (value === 1) updatedLike.push(userDetail.id);
      if (value === -1) updatedDislike.push(userDetail.id);
      setLikeChoice(value);
    }

    // Prepare updated question data
    const bodyData = {
      Details: { like: updatedLike, dislike: updatedDislike },
    };

    try {
      const response = await fetch(
        `${SERVER_URL}/api/problemset/update/${MainQuestion.problemNo}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(bodyData),
        }
      );
      const jsondata = await response.json();
      console.log(jsondata);

      if (jsondata.success) {
        setMainQuestion({
          ...MainQuestion,
          Details: { like: updatedLike, dislike: updatedDislike },
        });
      }
    } catch (error) {
      console.error("Error updating like/dislike:", error);
    }
  };
  function getDayOfYear() {
    const date = new Date();
    const start = new Date(date.getFullYear(), 0, 0);
    const diff = (date as any) - (start as any);
    const oneDay = 1000 * 60 * 60 * 24;
    return Math.floor(diff / oneDay);
  }

  const { handleCodeExecution } = context;
  type Language = "go" | "java" | "cpp" | "c";
  const [SelectedLanguage, setSelectedLanguage] = useState<Language>("c");
  const topics = MainQuestion.topic;
  const companies = MainQuestion.companies;
  const [code, setCode] = useState(
    MainQuestion.middleCode ? MainQuestion.middleCode.c : ""
  );
  interface TestResult {
    isSuccess?: "pass" | "failed" | "pending";
  }
  const [DisplaySubmitCodeResult, setDisplaySubmitCodeResult] = useState({
    input: "",
    output: "",
    expected: "",
  });
  useEffect(() => {
    console.log("DisplaySubmitCodeResult-", DisplaySubmitCodeResult);
  }, [DisplaySubmitCodeResult]);
  const [DisplayCustomRunCodeResult, setDisplayCustomRunCodeResult] = useState({
    input: "",
    output: "",
    expected: "",
  });
  useEffect(() => {
    console.log("DisplayCustomRunCodeResult-", DisplayCustomRunCodeResult);
  }, [DisplayCustomRunCodeResult]);

  const [ResultOfTest, setResultOfTest] = useState<TestResult[]>([]);
  const [QuestionStatus, setQuestionStatus] = useState(false);
  const constraints = MainQuestion.constraint;
  // State to manage visibility
  const [showQuestionInfos, setShowQuestionInfos] = useState({
    QuestionInfo1: false,
    QuestionInfo2: false,
  });
  const sampleTestCases = MainQuestion.sampleInputOutput;
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
          {topics &&
            topics.map((topic) => <TopicTag key={topic} label={topic} />)}
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
          {companies &&
            companies.map((topic) => <TopicTag key={topic} label={topic} />)}
        </>
      ),
    },
  ];
  const [spinnerStatus, setspinnerStatus] = useState<boolean>(false);
  useEffect(() => {
    console.log(spinnerStatus);
  }, [spinnerStatus]);

  useEffect(() => {
    console.log("day - ", getDayOfYear());
  }, []);

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
      let accepted = MainQuestion.accepted || 0;
      let submission = MainQuestion.submission || 0;

      let updatedSolvedProblems = [...userDetail.solvedProblemDetails];

      if (status && updatedSolvedProblems.includes(MainQuestion.id)) {
      } else if (status && !updatedSolvedProblems.includes(MainQuestion.id)) {
        accepted++;
        submission++;
      } else if (!status && updatedSolvedProblems.includes(MainQuestion.id)) {
      } else if (!status && !updatedSolvedProblems.includes(MainQuestion.id)) {
        submission++;
      }

      if (status && !updatedSolvedProblems.includes(MainQuestion.id)) {
        updatedSolvedProblems.push(MainQuestion.id);
      }

      const response = await fetch(`${SERVER_URL}/api/user/update/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: userDetail.token,
          solvedProblemDetails: updatedSolvedProblems,
        }),
      });

      const jsondata = await response.json();
      console.log("updatedUser------", jsondata);

      if (jsondata.success) {
        // Update local state with correct values
      }

      const response2 = await fetch(
        `${SERVER_URL}/api/problemset/update/${MainQuestion.problemNo}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            accepted,
            submission,
          }),
        }
      );

      const jsondata2 = await response2.json();
      console.log("updatedUser------", jsondata2);
      if (jsondata2.success) {
        setMainQuestion({
          ...MainQuestion,
          accepted,
          submission,
        });
        dispatch(
          setUserDetail({ solvedProblemDetails: updatedSolvedProblems })
        );
      }
    } catch (error) {
      console.error("Error updating submission status:", error);
    }
  };

  const handleRunCode = async () => {
    setspinnerStatus(true);
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
    let output = "";
    console.log(
      "codetesting----",
      code,
      "-----",
      MainQuestion.middleCode,
      "----",
      MainQuestion.middleCode &&
        code === MainQuestion.middleCode[SelectedLanguage]
    );
    if (
      MainQuestion.middleCode &&
      code === MainQuestion.middleCode[SelectedLanguage]
    ) {
      toast.error("Empty Code Not Accepted");
      setshowCustomTestCase(false);
      setShowResultTestCase(true);
      setspinnerStatus(false);
      return;
    }
    const data = {
      code: aboveCodeTemplate + code + belowCodeTemplate,
      language: SelectedLanguage,
      testcases: MainQuestion.testcases,
    };
    setDisplaySubmitCodeResult({
      input: "",
      output: "",
      expected: "",
    });

    try {
      console.log("data send--", data);
      let jsondata = await handleCodeExecution(data);
      let updateresult: any = "";
      if (!userDetail.activeDays.includes(getDayOfYear())) {
        updateresult = await fetch(`${SERVER_URL}/api/user/update/`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token: userDetail.token,
            activeDays: [...userDetail.activeDays, getDayOfYear()],
          }),
        });
        const jsondata2 = await updateresult.json();
        if (jsondata2.success) {
          dispatch(
            setUserDetail({
              activeDays: [...userDetail.activeDays, getDayOfYear()],
            })
          );
        }
      }

      console.log(jsondata);
      console.log("qwqwqqwq---", jsondata);
      console.log("qwqwqqwq---", jsondata.output);
      console.log("qwqwqqwq---", typeof jsondata.output);
      output = String(jsondata.output);

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
        } else {
          toast.error("Failed");
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
    MainQuestion.testcases?.map((value) => {
      console.log(
        value,
        " - - ",
        value.input,
        " - - ",
        typeof value,
        " - ",
        typeof value.input
      );
      setDisplaySubmitCodeResult({
        ...DisplaySubmitCodeResult,
        input: String(value.input),
        output: String(output),
        expected: String(value.output),
      });
    });
    setshowCustomTestCase(false);
    setShowResultTestCase(true);
    setspinnerStatus(false);
  };

  const toggleQuestionInfo = (
    QuestionInfoKey: keyof typeof showQuestionInfos
  ) => {
    setShowQuestionInfos((prevState) => ({
      ...prevState,
      [QuestionInfoKey]: !prevState[QuestionInfoKey],
    }));
  };

  const [ShowResultTestCase, setShowResultTestCase] = useState(false);
  useEffect(() => {
    console.log(ShowResultTestCase);
  }, [ShowResultTestCase]);

  const handleCustomTestCode = async () => {
    setCustomRunCodeSpinnerStatus(true);
    const userinput = DisplayCustomRunCodeResult.input || "";
    const aboveCodeTemplate = MainQuestion.aboveCodeTemplate
      ? MainQuestion.aboveCodeTemplate[SelectedLanguage]
      : "";
    const belowCodeTemplate = MainQuestion.belowCodeTemplate
      ? MainQuestion.belowCodeTemplate[SelectedLanguage]
      : "";
    const correctMiddleCode =
      (MainQuestion.correctMiddleCode &&
        MainQuestion.correctMiddleCode[`${SelectedLanguage}`]) ||
      "";
    let expected = "";
    let output = "";
    console.log(
      "codetesting----",
      correctMiddleCode,
      "-----",
      MainQuestion.correctMiddleCode,
      "----"
    );
    if (
      MainQuestion.middleCode &&
      code === MainQuestion.middleCode[SelectedLanguage]
    ) {
      toast.error("Empty Code Not Accepted");
      setShowResultTestCase(false);
      setshowCustomTestCase(true);
      setCustomRunCodeSpinnerStatus(false);
      return;
    }
    const expectedResultData = {
      code: aboveCodeTemplate + correctMiddleCode + belowCodeTemplate,
      language: SelectedLanguage,
      testcases: [{ input: userinput, output: "" }],
    };
    const userResultData = {
      code: aboveCodeTemplate + code + belowCodeTemplate,
      language: SelectedLanguage,
      testcases: [{ input: userinput, output: "" }],
    };

    console.log(aboveCodeTemplate, " - - - ", "aboveCodeTemplate,");
    console.log(belowCodeTemplate, " - - - ", "belowCodeTemplate,");
    console.log(correctMiddleCode, " - - - ", "correctMiddleCode,");

    setDisplaySubmitCodeResult({
      input: "",
      output: "",
      expected: "",
    });

    try {
      console.log("expectedResultData send--", expectedResultData);
      let jsondata = await handleCodeExecution(expectedResultData);
      let jsondata_user = await handleCodeExecution(userResultData);
      let updateresult: any = "";
      if (!userDetail.activeDays.includes(getDayOfYear())) {
        updateresult = await fetch(`${SERVER_URL}/api/user/update/`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token: userDetail.token,
            activeDays: [...userDetail.activeDays, getDayOfYear()],
          }),
        });
        const jsondata2 = await updateresult.json();
        if (jsondata2.success) {
          dispatch(
            setUserDetail({
              activeDays: [...userDetail.activeDays, getDayOfYear()],
            })
          );
        }
      }

      console.log(jsondata);
      console.log("qwqwqqwq---", jsondata);
      console.log("qwqwqqwq---", jsondata.output);
      console.log("qwqwqqwq---", typeof jsondata.output);
      expected = String(jsondata.output);
      console.log(jsondata_user);
      console.log("qwqwqqwq---", jsondata_user);
      console.log("qwqwqqwq---", jsondata_user.output);
      console.log("qwqwqqwq---", typeof jsondata_user.output);
      output = String(jsondata_user.output);

      let finalMsg = false;
      if (jsondata_user.success ) {
        finalMsg = true;
        if (finalMsg === true && (jsondata_user.output)===(jsondata.output)) {
          toast.success("Passed");
        } else {
          toast.error("Failed");
        }
      } else {
        toast.error("Failed");
      }
    } catch (error) {
      console.log(error);;
    }

    setDisplayCustomRunCodeResult({
      ...DisplaySubmitCodeResult,
      input: String(userinput),
      output: String(output),
      expected: String(expected),
    });

    setShowResultTestCase(false);
    setshowCustomTestCase(true);
    setCustomRunCodeSpinnerStatus(false);
  };

  return (
    <>
      <div style={styles.container}>
        {/* Left Section */}
        <div style={{ ...styles.leftSection, minWidth: "45%" }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <h1 style={styles.title}>
              {MainQuestion.problemNo}. {MainQuestion.problemName}
            </h1>
            <div
              style={styles.status}
              className={`d-${QuestionStatus ? "inline-block" : "none"}`}
            >
              <span style={styles.solvedText}>Solved</span>
              <span style={styles.checkmark}>✅</span>
            </div>
          </div>
          <pre
            style={{
              ...styles.description,
              overflow: "unset",
              textWrap: "pretty",
              fontFamily:
                "-apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji",
            }}
          >
            {MainQuestion.description}
          </pre>
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
          <div className="d-flex justify-content-between align-items-center ">
            <div>
              <span>Accepted</span>
              <span className="ms-2 fw-bold">{MainQuestion.accepted}</span>
            </div>
            <div>
              <span>Submissions</span>
              <span className="ms-2 fw-bold">{MainQuestion.submission}</span>
            </div>
            <div>
              <span>Acceptance Rate</span>
              <span className="ms-2 fw-bold">
                {MainQuestion.accepted && MainQuestion.submission
                  ? (
                      (MainQuestion.accepted / MainQuestion.submission) *
                      100
                    ).toFixed(2)
                  : 0}
                %
              </span>
            </div>
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
                  <FontAwesomeIcon
                    icon={faThumbsUp}
                    className="me-1"
                    style={{ color: `${LikeChoice === 1 ? "green" : "gray"}` }}
                    onClick={() => handleLikeChoice(1)}
                  />
                  <span>{MainQuestion.Details?.like.length}</span>
                </div>
                {/* Thumbs Down */}
                <div
                  className="d-flex align-items-center"
                  onClick={() => {}}
                  style={{ cursor: "pointer" }}
                >
                  <FontAwesomeIcon
                    icon={faThumbsDown}
                    className="me-1"
                    style={{ color: `${LikeChoice === -1 ? "red" : "gray"}` }}
                    onClick={() => handleLikeChoice(-1)}
                  />
                  <span>{MainQuestion.Details?.dislike.length}</span>
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
            height={"40vh"}
            defaultLanguage={SelectedLanguage}
            readOnly={false}
            fontSize={16}
            style={styles.codeEditor}
          />
          <div style={styles.actionButtons}>
            <button
              onClick={() => handleCustomTestCode()}
              style={{ ...styles.submitButton }}
              className="runbtn"
            >
              <svg
                aria-hidden="true"
                focusable="false"
                data-prefix="fas"
                data-icon="play"
                className="svg-inline--fa fa-play absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                role="img"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 384 512"
              >
                <path
                  fill="currentColor"
                  d="M73 39c-14.8-9.1-33.4-9.4-48.5-.9S0 62.6 0 80V432c0 17.4 9.4 33.4 24.5 41.9s33.7 8.1 48.5-.9L361 297c14.3-8.7 23-24.2 23-41s-8.7-32.2-23-41L73 39z"
                ></path>
              </svg>{" "}
              Run
              <img
                className={`d-${
                  CustomRunCodeSpinnerStatus ? "inline" : "none"
                }`}
                src={spinner}
                height={"22px"}
                width={"22px"}
              />
            </button>
            <button
              disabled={spinnerStatus}
              onClick={() => handleRunCode()}
              style={{ ...styles.submitButton }}
              className="runbtn"
            >
              <svg
                aria-hidden="true"
                focusable="false"
                data-prefix="far"
                data-icon="cloud-arrow-up"
                className="svg-inline--fa fa-cloud-arrow-up absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                role="img"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 640 512"
                style={{ fontSize: "1.1rem" }}
              >
                <path
                  fill="currentColor"
                  d="M354.9 121.7c13.8 16 36.5 21.1 55.9 12.5c8.9-3.9 18.7-6.2 29.2-6.2c39.8 0 72 32.2 72 72c0 4-.3 7.9-.9 11.7c-3.5 21.6 8.1 42.9 28.1 51.7C570.4 276.9 592 308 592 344c0 46.8-36.6 85.2-82.8 87.8c-.6 0-1.3 .1-1.9 .2H504 144c-53 0-96-43-96-96c0-41.7 26.6-77.3 64-90.5c19.2-6.8 32-24.9 32-45.3l0-.2v0 0c0-66.3 53.7-120 120-120c36.3 0 68.8 16.1 90.9 41.7zM512 480v-.2c71.4-4.1 128-63.3 128-135.8c0-55.7-33.5-103.7-81.5-124.7c1-6.3 1.5-12.8 1.5-19.3c0-66.3-53.7-120-120-120c-17.4 0-33.8 3.7-48.7 10.3C360.4 54.6 314.9 32 264 32C171.2 32 96 107.2 96 200l0 .2C40.1 220 0 273.3 0 336c0 79.5 64.5 144 144 144H464h40 8zM223 255c-9.4 9.4-9.4 24.6 0 33.9s24.6 9.4 33.9 0l39-39V384c0 13.3 10.7 24 24 24s24-10.7 24-24V249.9l39 39c9.4 9.4 24.6 9.4 33.9 0s9.4-24.6 0-33.9l-80-80c-9.4-9.4-24.6-9.4-33.9 0l-80 80z"
                ></path>
              </svg>{" "}
              Submit
              <img
                className={`d-${spinnerStatus ? "inline" : "none"}`}
                src={spinner}
                height={"22px"}
                width={"22px"}
              />
            </button>
          </div>
          <TestStatus tests={ResultOfTest} />
          <div className="container mt-3">
            <div className="card">
              <div className="card-header bg-dark text-light d-flex justify-content-between">
                <span>Result</span>
                <span className="">
                  <svg
                    className={`d-${ShowResultTestCase ? "inline" : "none"}`}
                    width="25"
                    height="25"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    onClick={() => setShowResultTestCase(false)}
                  >
                    <rect width="24" height="24" rx="4" fill="#333" />
                    <path
                      d="M6 15l6-6 6 6"
                      stroke="gray"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <svg
                    className={`d-${!ShowResultTestCase ? "inline" : "none"}`}
                    width="25"
                    height="25"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    onClick={() => setShowResultTestCase(true)}
                  >
                    <rect width="24" height="24" rx="4" fill="#333" />
                    <path
                      d="M6 9l6 6 6-6"
                      stroke="gray"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </div>
              <div
                className={`card-body d-${
                  ShowResultTestCase ? "block" : "none"
                }`}
              >
                <div className="mt-3">
                  <label className="form-label">Input</label>
                  <textarea
                    className="form-control"
                    rows={2}
                    disabled
                    value={DisplaySubmitCodeResult.input}
                  ></textarea>
                </div>
                <div className="mt-3">
                  <label className="form-label">Output</label>
                  <textarea
                    className="form-control"
                    rows={2}
                    value={DisplaySubmitCodeResult.output}
                    disabled
                  ></textarea>
                </div>
                <div className="mt-3">
                  <label className="form-label">Expected Output</label>
                  <textarea
                    className="form-control"
                    rows={2}
                    disabled
                    value={DisplaySubmitCodeResult.expected}
                  ></textarea>
                </div>
              </div>
            </div>
          </div>
          <div className="container mt-3">
            <div className="card">
              <div className="card-header bg-dark text-light d-flex justify-content-between">
                <span>Custom Testcase</span>
                <span className="">
                  <svg
                    className={`d-${showCustomTestCase ? "inline" : "none"}`}
                    width="25"
                    height="25"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    onClick={() => setshowCustomTestCase(false)}
                  >
                    <rect width="24" height="24" rx="4" fill="#333" />
                    <path
                      d="M6 15l6-6 6 6"
                      stroke="gray"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <svg
                    className={`d-${!showCustomTestCase ? "inline" : "none"}`}
                    width="25"
                    height="25"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    onClick={() => setshowCustomTestCase(true)}
                  >
                    <rect width="24" height="24" rx="4" fill="#333" />
                    <path
                      d="M6 9l6 6 6-6"
                      stroke="gray"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </div>
              <div
                className={`card-body d-${
                  showCustomTestCase ? "block" : "none"
                }`}
              >
                <div className="mt-3">
                  <label className="form-label">Input</label>
                  <textarea
                    className="form-control"
                    rows={2}
                    onChange={(e) =>
                      setDisplayCustomRunCodeResult({
                        ...DisplayCustomRunCodeResult,
                        input: e.target.value,
                      })
                    }
                    value={DisplayCustomRunCodeResult.input}
                  ></textarea>
                </div>
                <div className="mt-3">
                  <label className="form-label">Output</label>
                  <textarea
                    className="form-control"
                    rows={2}
                    value={DisplayCustomRunCodeResult.output}
                    disabled
                  ></textarea>
                </div>
                <div className="mt-3">
                  <label className="form-label">Expected Output</label>
                  <textarea
                    rows={2}
                    value={DisplayCustomRunCodeResult.expected}
                    className="form-control"
                    disabled
                  ></textarea>
                </div>
              </div>
            </div>
          </div>
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
    backgroundColor: "rgb(14 114 221)",
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
