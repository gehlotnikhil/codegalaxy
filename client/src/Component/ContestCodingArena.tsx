import React, { useContext, useEffect, useState } from "react";
import CodeEditor from "./CodeEditor";
import TestStatus from "./TestBox";
import spinner from "../assets/tube-spinner.svg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTag } from "@fortawesome/free-solid-svg-icons";
import TopicTag from "./TopicTag";
import MainContext from "../context/main";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router";
import { useSelector } from "react-redux";
import { RootStateType } from "../store";
import { useDispatch } from "react-redux";
import { setUserDetail } from "../store/slice/UserDetailSlice";
const ContestCodingArena: React.FC = () => {
  const dispatch = useDispatch();
  const userDetail = useSelector((state: RootStateType) => state.userDetail);
  interface MainQuestionType {
    id?: string;
    problemName?: string;
    description?: string;
    constraint?: string[];
    topic?: (
      | "ARRAY"
      | "STRING"
      | "BINARYSEARCH"
      | "DYNAMICPROGRAMMING"
      | "GRAPH"
    )[];

    status?: "SOLVED" | "UNSOLVED";
    sampleInputOutput?: { input: string; output: string }[];
    testcases?: { input: string; output: string }[];
    aboveCodeTemplate?: { go: string; java: string; cpp: string; c: string };
    middleCode?: { go: string; java: string; cpp: string; c: string };
    correctMiddleCode?: { go: string; java: string; cpp: string; c: string };
    belowCodeTemplate?: { go: string; java: string; cpp: string; c: string };
  }
  const [MainQuestion, setMainQuestion] = useState<MainQuestionType>({});

  const context = useContext(MainContext);
  const { SERVER_URL } = context;
  const param = useParams<{ problemid: string,contestid:string }>();
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

  const loadMainQuestion = async (id: string) => {
    const response = await fetch(
      `${SERVER_URL}/api/contestproblem/getspecificproblem?id=${id}`,
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
  interface ContestType{
    id               :string
    contestNo        :number      
    contestName      :string
    duration         :number
    startTime        :string
    problems         :string[]
  }
  const [Contest, setContest] = useState<ContestType | null>(null)
  const loadContest = async(contestid:string)=>{
    const result = await fetch(`${SERVER_URL}/api/contest/getspecificcontest?id=${contestid}`,{
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
    const jsondata = await result.json()
    if(jsondata.success){
      console.log("contest done - ",jsondata.result);
      
      setContest(jsondata.result)
    }else{
      navigate("/error")
    }
  }
  useEffect(() => {
    console.log(typeof param.problemid, "param", param.problemid);
    loadMainQuestion(param.problemid as string);
    loadContest(param.contestid as string)
  }, []);

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
  const updateLeaderBoard=async(status:("PASS"|"FAIL"),problemid=param.problemid,contestid=param.contestid)=>{
console.log("status - ",status);
console.log("problemid - ",problemid);
console.log("contestid - ",contestid);

if(status ==="PASS"){
  const response1 = await fetch(`${SERVER_URL}/api/contest/leaderboard/update/${contestid}`,{
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      userid:userDetail.id,
      problemid:problemid,
      startTime:Contest?.startTime,
      duration:Contest?.duration
  })
})
const res1 = await response1.json()
if(res1.success){
  console.log("All Done");
  
}else{
  console.log(res1.msg);
  
}
console.log("Let see - ");
}


  }
  const updateContestDetailInUser =async(status:("PASS"|"FAIL"),problemid=param.problemid,contestid=param.contestid)=>{
console.log("status - ",status);
console.log("problemid - ",problemid);
console.log("contestid - ",contestid);

if(status ==="PASS"){
  const response1 = await fetch(`${SERVER_URL}/api/contest/usercontestdetail/update/${contestid}`,{
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      userid:userDetail.id,
      problemid:problemid
  })
})
const res1 = await response1.json()
if(res1.success){
  console.log("All Done");
  
}else{
  console.log(res1.msg);
  
}
console.log("Let see - ");
}


  }
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [clientId, setClientId] = useState<string | null>(null);
  const [responses, setResponses] = useState<any[]>([]);
  
  useEffect(() => {
    console.log("socket - ", socket);
  }, [socket]);
  
  useEffect(() => {
    console.log("clientId - ", clientId);
  }, [clientId]);
  
  useEffect(() => {
    console.log("responses - ", responses);
  }, [responses]);
  
  const connectAndSendMessage = (payload: any): Promise<any> => {
    return new Promise((resolve, reject) => {
      console.log("Connecting WebSocket...");
  
      const newSocket = new WebSocket("ws://localhost:8080");
  
      const timeout = setTimeout(() => {
        console.error("WebSocket response timeout after 10 seconds");
        newSocket.close();
        reject({ success: false });
      }, 10000); // 10 seconds timeout
  
      newSocket.onopen = () => {
        console.log("WebSocket connection established");
        setSocket(newSocket);
      };
  
      newSocket.onmessage = async (event) => {
        clearTimeout(timeout); // Clear timeout on receiving a message
        const data = JSON.parse(event.data);
        console.log("Message from server:", data);
  
        if (data.type === "welcome") {
          setClientId(data.clientId);
          console.log(`Assigned clientId: ${data.clientId}`);
  
          // Send message now that we have clientId
          sendMessage(newSocket, { ...payload, clientId: data.clientId });
        } else if (data.type === "response") {
          setResponses((prev) => [...prev, data.message]);
          resolve(data.message);
        } else if (data.type === "error") {
          console.error(`Error from server: ${data.message}`);
          reject(new Error(data.message));
        } else if (data.type === "question") {
          try {
            const parsedData = JSON.parse(data.message);
            console.log({ success: true, data: parsedData });
            resolve(parsedData.result);
          } catch (error) {
            console.error("Error parsing server response:", error);
            reject(error);
          }
        }
      };
  
      newSocket.onerror = (error) => {
        clearTimeout(timeout);
        console.error("WebSocket error:", error);
        reject(error);
      };
  
      newSocket.onclose = () => {
        clearTimeout(timeout);
        console.log("WebSocket connection closed");
        setSocket(null);
        setClientId(null);
      };
    }).catch(() => ({ success: false }));
  };
  
  const sendMessage = async (ws: WebSocket, mdata: any) => {
    try {
      const payload = JSON.stringify({
        clientId: mdata.clientId,
        content: "Test message from client",
      });
  
      ws.send(payload);
      console.log("Message sent via WebSocket");
  
      // Make a POST request
      const response = await fetch("http://localhost:5000/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          clientId: `${mdata.clientId}`,
          code: mdata.code,
          language: mdata.language,
          problemId: "1",
          testcases: mdata.testcases,
        }),
      });
  
      if (!response.ok) {
        throw new Error("Failed to submit the message");
      }
  
      console.log("Message sent successfully");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };
  
  const handleRunCode = async () => {
    setspinnerStatus(true);
    const testcases = MainQuestion.testcases || [];
    const aboveCodeTemplate = MainQuestion.aboveCodeTemplate?.[SelectedLanguage] || "";
    const belowCodeTemplate = MainQuestion.belowCodeTemplate?.[SelectedLanguage] || "";
  
    setResultOfTest(testcases.map(() => ({ isSuccess: "pending" })));
  
    if (MainQuestion.middleCode?.[SelectedLanguage] === code) {
      toast.error("Empty Code Not Accepted");
      setShowResultTestCase(true);
      setspinnerStatus(false);
      return;
    }
  
    const data = {
      code: aboveCodeTemplate + code + belowCodeTemplate,
      language: SelectedLanguage,
      testcases: testcases,
    };
  
    setDisplaySubmitCodeResult({ input: "", output: "", expected: "" });
  let output=""
    try {
      console.log("data send--", data);
      let jsondata: any = await connectAndSendMessage(data);
      
      console.log("Received response:", jsondata);
      output = String(jsondata.output || "");
  
      let finalMsg = false
      jsondata.result.map((e:any)=>{if(e===true){finalMsg=true}})
      let finalStatus = jsondata.result?.map((value: any) => ({
        isSuccess: value === true ? "pass" : "failed",
      })) || [];
  
      setResultOfTest(finalStatus);
  
      if (finalMsg) {
        setQuestionStatus(true);
        updateContestDetailInUser("PASS");
        updateLeaderBoard("PASS");
        toast.success("Passed");
      } else {
        toast.error("Failed");
      }
  
      if (!userDetail.activeDays.includes(getDayOfYear())) {
        const updateResponse = await fetch(`${SERVER_URL}/api/user/update/`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token: userDetail.token,
            activeDays: [...userDetail.activeDays, getDayOfYear()],
          }),
        });
  
        const jsondata2 = await updateResponse.json();
        if (jsondata2.success) {
          dispatch(setUserDetail({ activeDays: [...userDetail.activeDays, getDayOfYear()] }));
        }
      }
  
      testcases.forEach((value) => {
        setDisplaySubmitCodeResult((prev) => ({
          ...prev,
          input: String(value.input),
          output: output,
          expected: String(value.output),
        }));
      });
  
      setShowResultTestCase(true);
    } catch (error) {
      console.error(error);
      setResultOfTest(testcases.map(() => ({ isSuccess: "failed" })));
      toast.error("Execution failed.");
    } finally {
      setspinnerStatus(false);
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
      if (jsondata_user.success) {
        finalMsg = true;
        if (finalMsg === true) {
          toast.success("Passed");
        } else {
          toast.error("Failed");
        }
      } else {
        toast.error("Failed");
      }
    } catch (error) {
      console.log(error);
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

export default ContestCodingArena;
