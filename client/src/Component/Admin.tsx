import { useState } from "react";
import CodeEditor from "./CodeEditor2";
import MainContext from "../context/main";
import { useContext, useEffect } from "react";
import { toast } from "react-toastify";

function Admin() {
  const context = useContext(MainContext);
  const [CodeValue, setCodeValue] = useState("");
  const handleEditorChange = (value: string | undefined) => {
    setCodeValue(value || "");
  };
  useEffect(() => {
    console.log(CodeValue);
  }, [CodeValue]);

  const { Demo, setDemo, SERVER_URL } = context;
  useEffect(() => {
    console.log("demo-", Demo);
  }, [Demo]);

  interface InOutTestCase {
    input: string;
    output: string;
  }

  interface CodeTemplate{
    c:string;
    cpp:string;
    java:string;
    go:string;
  }
  interface CodeTemplate{
    c:string;
    cpp:string;
    java:string;
    go:string;
  }
  interface ProblemSet {
    problemNo?:number;
    problemName?: string;
    description?: string;
    companies?: String[];
    constraint?: String[];
    topic?: String[];
    category?: "ALGORITHMS" | "DP" | "CONCURRANCY";
    testcases?: InOutTestCase[];
    sampleInputOutput?: InOutTestCase[];
    aboveCodeTemplate:CodeTemplate;
    belowCodeTemplate:CodeTemplate;
    middleCode:CodeTemplate;
    correctMiddleCode:CodeTemplate;
    

  }

  const initialModelFieldData = {


    problemNo: null,
    contestNo: null,
    contestName: null,
    duration: null,
    startTime: null,
    problems: null,
    status: null,
    problemName: null,
    description: null,
    companies: null,
    constraint: null,
    topic: null,
    category: null,
    testcases: null,
    sampleInputOutput: null,
    aboveCodeTemplate:null,
    belowCodeTemplate:null,
    middleCode:null,
    correctMiddleCode:null

   

  };
  const [ModalFieldData, setModalFieldData] = useState(initialModelFieldData);

  const [ModelHeading, setModelHeading] = useState("");
  const initialDisplayValue = {
    problemNo:false,
    contestNo: false,
    contestName: false,
    duration: false,
    startTime: false,
    problems: false,
    status: false,
    problemName: false,
    description: false,
    companies: false,
    constraint: false,
    topic: false,
    category: false,
    testcases: false,
    sampleInputOutput: false,
    aboveCodeTemplate:false,
    belowCodeTemplate:false,
    middleCode:false,
    correctMiddleCode:false
  
  };
  const [DisplayField, setDisplayField] = useState(initialDisplayValue);
  const handleChangeModelHeading = (e: string): any => {
    setDisplayField(initialDisplayValue);
    if (e === "btn1") {
      setModelHeading("Create Contest");
      setDisplayField({
        ...initialDisplayValue,
        contestName: true,
        duration: true,
        startTime: true,
        problems: true,
        status: true,
      });
    } else if (e === "btn2") {
      setModelHeading("Update Contest");
      setDisplayField({
        ...initialDisplayValue,
        contestNo: true,
        contestName: true,
        duration: true,
        startTime: true,
        problems: true,
        status: true,
      });
    } else if (e === "btn3") {
      setModelHeading("Delete Contest");
      setDisplayField({
        ...initialDisplayValue,
        contestNo: true,
      });
    } else if (e === "btn4") {
      setModelHeading("Create Problem");
      setDisplayField({
        ...initialDisplayValue,
        problemNo: true,
        problemName: true,
        description: true,
        companies: true,
        constraint: true,
        topic: true,
        category: true,
        testcases: true,
        sampleInputOutput: true,
        aboveCodeTemplate:true,
        belowCodeTemplate:true,
        middleCode:true,
        correctMiddleCode:true

      });
    } else if (e === "btn5") {
      setModelHeading("Update Problem");
      setDisplayField({
        ...initialDisplayValue,
        problemNo:true,
        problemName: true,
        description: true,
        companies: true,
        constraint: true,
        topic: true,
        category: true,
        testcases: true,
        sampleInputOutput: true,
        aboveCodeTemplate:true,
        belowCodeTemplate:true,
        middleCode:true,
        correctMiddleCode:true
      });
    } else if (e === "btn6") {
      setModelHeading("Delete Problem");
      setDisplayField({
        ...initialDisplayValue,
        problemNo: true,
      });
    } else if (e === "get1") {
      handleGetAllContest();
    } else if (e === "get2") {
      setModelHeading("Get Specific Contest");
      setDisplayField({
        ...initialDisplayValue,
        contestNo: true,
      });
    } else if (e === "get3") {
      handleGetAllProblem();
    } else if (e === "get4") {
      setModelHeading("Get Specific Problem");
      setDisplayField({
        ...initialDisplayValue,
        problemNo: true,
      });
    }
  };
  // const abc = "";
  const handleFieldValueChange = (e: any): any => {
    setModalFieldData({
      ...ModalFieldData,
      [e.target.name]: e.target.value,
    });
  };
  useEffect(() => {
    console.log(ModalFieldData);
  }, [ModalFieldData]);
  useEffect(() => {
    console.log(DisplayField);
  }, [DisplayField]);

  useEffect(() => {
    console.log("ModelHeading updated:", ModelHeading);
    setModalFieldData(initialModelFieldData);
  }, [ModelHeading]);

  const handleCreateContest = async (): Promise<any> => {
    try {
      let { contestName, duration, startTime, problems, status } =
        ModalFieldData;
      if (
        contestName === null ||
        duration === null ||
        startTime === null ||
        problems === null ||
        status === null
      ) {
        return toast.error("Failed to create constest");
      }
      const problemsData = (problems as string).split(",");
      problemsData.map((value) => {
        return Number(value);
      });
      const response = await fetch(`${SERVER_URL}/api/contest/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contestName,
          duration: Number(duration),
          startTime,
          problemsData,
          status,
        }),
      });
      const jsondata = await response.json();
      if (jsondata.success) {
        console.log(jsondata);
        toast.success("Contest created successfully");
      } else {
        toast.error("Failed to create constest");
      }
    } catch (error) {
      toast.error("Internal server error");
      console.log(error);
    }
  };
  const handleUpdateContest = async (): Promise<any> => {
    let { contestNo, contestName, duration, startTime, problems, status } =
      ModalFieldData;
    if (contestNo === null) {
      return toast.error("Failed to update constest");
    }
    let bodyData: {
      contestNo?: string;
      contestName?: string;
      duration?: Number;
      startTime?: string;
      problems?: Number[];
      status?: string;
    } = {};
    let problemsData = problems
      ? (problems as string).split(",").map((value) => Number(value))
      : [];

    if (contestName !== null) bodyData.contestName = contestName;
    if (duration !== null) bodyData.duration = Number(duration);
    if (startTime !== null) bodyData.startTime = startTime;
    if (problems !== null) bodyData.problems = problemsData;
    if (status !== null) bodyData.status = status;

    console.log(bodyData);
    try {
      const response = await fetch(
        `${SERVER_URL}/api/contest/update/${contestNo}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(bodyData),
        }
      );
      const jsondata = await response.json();
      console.log(jsondata);
    } catch (error) {
      console.log(error);
    }
  };
  const handleDeleteContest = async (): Promise<any> => {
    let { contestNo } = ModalFieldData;
    if (contestNo === null) {
      return toast.error("Failed to delete contest");
    }
    try {
      const response = await fetch(
        `${SERVER_URL}/api/contest/delete/${contestNo}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const jsondata = await response.json();
      console.log(jsondata);
    } catch (error) {
      console.log(error);
    }
  };
  const handleCreateProblem = async (): Promise<any> => {
    try {
      let {
        problemNo,
        problemName,
        description,
        companies,
        constraint,
        topic,
        category,
        testcases,
        sampleInputOutput,
        middleCode,
        correctMiddleCode,
        aboveCodeTemplate,
        belowCodeTemplate
      } = ModalFieldData;
      if (
        category === null ||
        companies === null ||
        problemName === null ||
        description === null ||
        testcases === null ||
        constraint === null ||
        topic === null ||
        sampleInputOutput === null||
        middleCode===null ||
        correctMiddleCode===null ||
        aboveCodeTemplate===null ||
        belowCodeTemplate===null 
      ) {
        return toast.error("Failed to create problem");
      }
      console.log(problemNo);
      
      const bodyData: ProblemSet = {
        problemName,
        description,
        companies: (companies as string).split(","),
        constraint: (constraint as string).split(","),
        topic: (topic as string).split(","),
        category,
        testcases: JSON.parse(testcases),
        sampleInputOutput: JSON.parse(sampleInputOutput),
        middleCode:JSON.parse(middleCode),
        correctMiddleCode:JSON.parse(correctMiddleCode),
        belowCodeTemplate:JSON.parse(belowCodeTemplate),
        aboveCodeTemplate:JSON.parse(aboveCodeTemplate)
      };
console.log(bodyData);

      const response = await fetch(`${SERVER_URL}/api/problemset/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bodyData),
      });

      const jsondata = await response.json();
      if (jsondata.success) {
        toast.success("Problem created successfully");
      } else {
        toast.error("Failed to create problem");
      }
      console.log(jsondata);
    } catch (error) {
      toast.error("Internal server error");
      console.log(error);
    }
  };
  const handleUpdateProblem = async (): Promise<any> => {
    let {
      problemNo,
      problemName,
      description,
      companies,
      constraint,
      topic,
      category,
      testcases,
      sampleInputOutput,
      aboveCodeTemplate,
      belowCodeTemplate,
      middleCode,
      correctMiddleCode
    } = ModalFieldData;
    if (problemNo === null) {
      return toast.error("Failed to update problem");
    }
    let bodyData: any = {
      
    };
    // let problemsData = problems
    //   ? (problems as string).split(",").map((value) => Number(value))
    //   : [];
    if (problemName !== null) bodyData.problemName = problemName;
    if (description !== null) bodyData.description = description;
    if (companies !== null)
      bodyData.companies = (companies as string).split(",");
    if (constraint !== null)
      bodyData.constraint = (constraint as string).split(",");
    if (topic !== null) bodyData.topic = (topic as string).split(",");
    if (category !== null) bodyData.category = category;
    if (testcases !== null) bodyData.testcases = JSON.parse(testcases);
    if (sampleInputOutput !== null)
      bodyData.sampleInputOutput = JSON.parse(sampleInputOutput);
    if (middleCode !== null) bodyData.middleCode = JSON.parse(middleCode);
    if (correctMiddleCode !== null) bodyData.correctMiddleCode = JSON.parse(correctMiddleCode);
    if (aboveCodeTemplate !== null) bodyData.aboveCodeTemplate = JSON.parse(aboveCodeTemplate);
    if (belowCodeTemplate !== null) bodyData.belowCodeTemplate = JSON.parse(belowCodeTemplate);

    console.log(bodyData);
    try {
      const response = await fetch(
        `${SERVER_URL}/api/problemset/update/${problemNo}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(bodyData),
        }
      );
      const jsondata = await response.json();
      console.log(jsondata);
    } catch (error) {
      console.log(error);
    }
  };
  const handleDeleteProblem = async (): Promise<any> => {
    let { problemNo } = ModalFieldData;
    if (problemNo === null) {
      return toast.error("Failed to delete problem");
    }
    try {
      const response = await fetch(
        `${SERVER_URL}/api/problemset/delete/${problemNo}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const jsondata = await response.json();
      console.log(jsondata);
    } catch (error) {
      console.log(error);
    }
  };
  function handleSendQuery() {
    console.log("1");

    if (ModelHeading === "Create Contest") {
      handleCreateContest();
    } else if (ModelHeading === "Update Contest") {
      handleUpdateContest();
    } else if (ModelHeading === "Delete Contest") {
      handleDeleteContest();
    } else if (ModelHeading === "Create Problem") {
      handleCreateProblem();
    } else if (ModelHeading === "Update Problem") {
      handleUpdateProblem();
    } else if (ModelHeading === "Delete Problem") {
      handleDeleteProblem();
    } else if (ModelHeading === "Get Specific Contest") {
      handleGetSpecificContest();
    } else if (ModelHeading === "Get Specific Problem") {
      handleGetSpecificProblem();
    }
  }

  const handleGetAllProblem = async () => {
    try {
      const response = await fetch(
        `${SERVER_URL}/api/problemset/getallproblem`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const jsondata = await response.json();
      console.log(jsondata);
      setCodeValue(JSON.stringify(jsondata, null, 2));
    } catch (error) {
      console.log(error);
    }
  };
  const handleGetSpecificProblem = async () => {
    let { problemNo } = ModalFieldData;
    if (problemNo === null) {
      return toast.error("failed to fetch specific contest");
    }
    try {
      const response = await fetch(
        `${SERVER_URL}/api/problemset/getspecificproblem?no=${problemNo}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const jsondata = await response.json();
      console.log(jsondata);
      setCodeValue(JSON.stringify(jsondata, null, 2));
    } catch (error) {
      console.log(error);
    }
  };
  const handleGetAllContest = async () => {
    try {
      const response = await fetch(`${SERVER_URL}/api/contest/getallcontest`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const jsondata = await response.json();
      console.log(jsondata);
      setCodeValue(JSON.stringify(jsondata, null, 2));
    } catch (error) {
      console.log(error);
    }
  };
  const handleGetSpecificContest = async () => {
    let { contestNo } = ModalFieldData;
    if (contestNo === null) {
      return toast.error("failed to fetch specific contest");
    }
    try {
      const response = await fetch(
        `${SERVER_URL}/api/contest/getspecificcontest?no=${contestNo}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const jsondata = await response.json();
      console.log(jsondata);
      setCodeValue(JSON.stringify(jsondata, null, 2));
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <div>
        <div
          style={{ maxHeight: "100vh" }}
          className=" bg-dark modal fade text-dark"
          id="exampleModal"
          tabIndex={-1}
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h1 className="modal-title fs-5" id="exampleModalLabel">
                  {ModelHeading}
                </h1>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <form>
                  <div className="contest">
                    <div
                      className={`mb-3 ${
                        DisplayField.contestNo ? "d-block" : "d-none"
                      }`}
                    >
                      <label htmlFor="name" className="col-form-label">
                        Contest No:
                      </label>
                      <input
                        type="text"
                        value={ModalFieldData.contestNo || ""}
                        name="contestNo"
                        onChange={handleFieldValueChange}
                        className="form-control"
                        id=""
                      />
                    </div>
                    <div
                      className={`mb-3 ${
                        DisplayField.contestName ? "d-block" : "d-none"
                      }`}
                    >
                      <label htmlFor="name" className="col-form-label">
                        Contest Name:
                      </label>
                      <input
                        type="text"
                        value={ModalFieldData.contestName || ""}
                        name="contestName"
                        onChange={handleFieldValueChange}
                        className="form-control"
                        id=""
                      />
                    </div>
                    <div
                      className={`mb-3 ${
                        DisplayField.duration ? "d-block" : "d-none"
                      }`}
                    >
                      <label htmlFor="name" className="col-form-label">
                        Duration:
                      </label>
                      <input
                        type="text"
                        name="duration"
                        value={ModalFieldData.duration || ""}
                        onChange={handleFieldValueChange}
                        className="form-control"
                        id=""
                      />
                    </div>
                    <div
                      className={`mb-3 ${
                        DisplayField.startTime ? "d-block" : "d-none"
                      }`}
                    >
                      <label htmlFor="name" className="col-form-label">
                        Start Time:
                      </label>
                      <input
                        type="text"
                        value={ModalFieldData.startTime || ""}
                        name="startTime"
                        onChange={handleFieldValueChange}
                        className="form-control"
                        id=""
                      />
                    </div>
                    <div
                      className={`mb-3 ${
                        DisplayField.problems ? "d-block" : "d-none"
                      }`}
                    >
                      <label htmlFor="name" className="col-form-label">
                        Problems:
                      </label>
                      <input
                        type="text"
                        value={ModalFieldData.problems || ""}
                        name="problems"
                        onChange={handleFieldValueChange}
                        className="form-control"
                        id=""
                      />
                    </div>
                  </div>
                  <div className="problem">
                    <div
                      className={`mb-3 ${
                        DisplayField.problemNo ? "d-block" : "d-none"
                      }`}
                    >
                      <label htmlFor="name" className="col-form-label">
                        Problem No:
                      </label>
                      <input
                        type="text"
                        value={ModalFieldData.problemNo || ""}
                        name="problemNo"
                        onChange={handleFieldValueChange}
                        className="form-control"
                        id=""
                      />
                    </div>
                    <div
                      className={`mb-3 ${
                        DisplayField.problemName ? "d-block" : "d-none"
                      }`}
                    >
                      <label htmlFor="name" className="col-form-label">
                        Problem Name:
                      </label>
                      <input
                        type="text"
                        value={ModalFieldData.problemName || ""}
                        name="problemName"
                        onChange={handleFieldValueChange}
                        className="form-control"
                        id=""
                      />
                    </div>
                    <div
                      className={`mb-3 ${
                        DisplayField.description ? "d-block" : "d-none"
                      }`}
                    >
                      <label htmlFor="name" className="col-form-label">
                        Describtion:
                      </label>
                      <input
                        type="text"
                        value={ModalFieldData.description || ""}
                        name="description"
                        onChange={handleFieldValueChange}
                        className="form-control"
                        id=""
                      />
                    </div>
                    
                    
                    <div
                      className={`mb-3 ${
                        DisplayField.constraint ? "d-block" : "d-none"
                      }`}
                    >
                      <label htmlFor="name" className="col-form-label">
                        Constraints:
                      </label>
                      <input
                        type="text"
                        value={ModalFieldData.constraint || ""}
                        name="constraint"
                        onChange={handleFieldValueChange}
                        className="form-control"
                        id=""
                      />
                    </div>
                    <div
                      className={`mb-3 ${
                        DisplayField.topic ? "d-block" : "d-none"
                      }`}
                    >
                      <label htmlFor="name" className="col-form-label">
                        Topic:
                      </label>
                      <input
                        type="text"
                        value={ModalFieldData.topic || ""}
                        name="topic"
                        onChange={handleFieldValueChange}
                        className="form-control"
                        id=""
                      />
                    </div>
                    
                    <div
                      className={`mb-3 ${
                        DisplayField.category ? "d-block" : "d-none"
                      }`}
                    >
                      <label htmlFor="name" className="col-form-label">
                        Category:
                      </label>
                      <input
                        type="text"
                        value={ModalFieldData.category || ""}
                        name="category"
                        onChange={handleFieldValueChange}
                        className="form-control"
                        id=""
                      />
                    </div>
                    <div
                      className={`mb-3 ${
                        DisplayField.companies ? "d-block" : "d-none"
                      }`}
                    >
                      <label htmlFor="name" className="col-form-label">
                        Company:
                      </label>
                      <input
                        type="text"
                        value={ModalFieldData.companies || ""}
                        name="companies"
                        onChange={handleFieldValueChange}
                        className="form-control"
                        id=""
                      />
                    </div>
                    <div
                      className={`mb-3 ${
                        DisplayField.testcases ? "d-block" : "d-none"
                      }`}
                    >
                      <label htmlFor="name" className="col-form-label">
                        TestCases:
                      </label>
                      <input
                        type="text"
                        value={ModalFieldData.testcases || ""}
                        name="testcases"
                        onChange={handleFieldValueChange}
                        className="form-control"
                        id=""
                      />
                    </div>
                    <div
                      className={`mb-3 ${
                        DisplayField.sampleInputOutput ? "d-block" : "d-none"
                      }`}
                    >
                      <label htmlFor="name" className="col-form-label">
                        Sample Input Output:
                      </label>
                      <input
                        type="text"
                        value={ModalFieldData.sampleInputOutput || ""}
                        name="sampleInputOutput"
                        onChange={handleFieldValueChange}
                        className="form-control"
                        id=""
                      />
                    </div>
                    <div
                      className={`mb-3 ${
                        DisplayField.aboveCodeTemplate ? "d-block" : "d-none"
                      }`}
                    >
                      <label htmlFor="name" className="col-form-label">
                      Above Code Template:
                      </label>
                      <input
                        type="text"
                        value={ModalFieldData.aboveCodeTemplate || ""}
                        name="aboveCodeTemplate"
                        onChange={handleFieldValueChange}
                        className="form-control"
                        id=""
                      />
                    </div>
                    <div
                      className={`mb-3 ${
                        DisplayField.belowCodeTemplate ? "d-block" : "d-none"
                      }`}
                    >
                      <label htmlFor="name" className="col-form-label">
                      Below Code Template:
                      </label>
                      <input
                        type="text"
                        value={ModalFieldData.belowCodeTemplate || ""}
                        name="belowCodeTemplate"
                        onChange={handleFieldValueChange}
                        className="form-control"
                        id=""
                      />
                    </div>
                    <div
                      className={`mb-3 ${
                        DisplayField.middleCode ? "d-block" : "d-none"
                      }`}
                    >
                      <label htmlFor="name" className="col-form-label">
                        Middle Code:
                      </label>
                      <input
                        type="text"
                        value={ModalFieldData.middleCode || ""}
                        name="middleCode"
                        onChange={handleFieldValueChange}
                        className="form-control"
                        id=""
                      />
                    </div>
                    <div
                      className={`mb-3 ${
                        DisplayField.correctMiddleCode ? "d-block" : "d-none"
                      }`}
                    >
                      <label htmlFor="name" className="col-form-label">
                      correct MiddleCode Code:
                      </label>
                      <input
                        type="text"
                        value={ModalFieldData.correctMiddleCode || ""}
                        name="correctMiddleCode"
                        onChange={handleFieldValueChange}
                        className="form-control"
                        id=""
                      />
                    </div>
                  </div>
                </form>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-bs-dismiss="modal"
                  data-bs-toggle="modal"
                  data-bs-target="#exampleModal"
                  data-bs-whatever="@getbootstrap"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={handleSendQuery}
                  className="btn btn-primary"
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className=" color-1  ">
          <div className="container pt-4">
            <div>
              <h2>Contest:</h2>
              <button
                type="button"
                onClick={() => {
                  handleChangeModelHeading("btn1");
                }}
                data-bs-toggle="modal"
                data-bs-target="#exampleModal"
                data-bs-whatever="@getbootstrap"
                className="m-2 btn btn-warning"
              >
                Create Contest
              </button>
              <button
                type="button"
                onClick={() => {
                  handleChangeModelHeading("btn2");
                }}
                data-bs-toggle="modal"
                data-bs-target="#exampleModal"
                data-bs-whatever="@getbootstrap"
                className="m-2 btn btn-primary"
              >
                Update Contest
              </button>
              <button
                type="button"
                onClick={() => {
                  handleChangeModelHeading("btn3");
                }}
                data-bs-toggle="modal"
                data-bs-target="#exampleModal"
                data-bs-whatever="@getbootstrap"
                className="m-2 btn btn-danger"
              >
                Delete Contest
              </button>
              <button
                type="button"
                onClick={() => {
                  handleChangeModelHeading("get1");
                }}
                className="m-2 btn btn-success"
              >
                Get All Contest
              </button>
              <button
                type="button"
                onClick={() => {
                  handleChangeModelHeading("get2");
                }}
                data-bs-toggle="modal"
                data-bs-target="#exampleModal"
                data-bs-whatever="@getbootstrap"
                className="m-2 btn btn-success"
              >
                Get Specific Contest
              </button>
            </div>
            <div className="pt-4">
              <h2>Problem:</h2>
              <button
                type="button"
                onClick={() => {
                  handleChangeModelHeading("btn4");
                }}
                data-bs-toggle="modal"
                data-bs-target="#exampleModal"
                data-bs-whatever="@getbootstrap"
                className="m-2 btn btn-warning"
              >
                Create Problem
              </button>
              <button
                type="button"
                onClick={() => {
                  handleChangeModelHeading("btn5");
                }}
                data-bs-toggle="modal"
                data-bs-target="#exampleModal"
                data-bs-whatever="@getbootstrap"
                className="m-2 btn btn-primary"
              >
                Update Problem
              </button>
              <button
                type="button"
                onClick={() => {
                  handleChangeModelHeading("btn6");
                }}
                data-bs-toggle="modal"
                data-bs-target="#exampleModal"
                data-bs-whatever="@getbootstrap"
                className="m-2 btn btn-danger"
              >
                Delete Problem
              </button>
              <button
                type="button"
                onClick={() => {
                  handleChangeModelHeading("get3");
                  if (setDemo) {
                    console.log("--------------");

                    setDemo("bye");
                  }
                }}
                className="m-2 btn btn-success"
              >
                Get All Problem
              </button>
              <button
                type="button"
                onClick={() => {
                  handleChangeModelHeading("get4");
                }}
                data-bs-toggle="modal"
                data-bs-target="#exampleModal"
                data-bs-whatever="@getbootstrap"
                className="m-2 btn btn-success"
              >
                Get Specific Problem
              </button>
            </div>
            <div className="">
              <button
                className="m-2 btn btn-light"
                onClick={() => {
                  setCodeValue("");
                }}
              >
                Clear All
              </button>
            </div>
            <div
              className="codeeditor mt-4 bg-dark"
              style={{ maxHeight: "40vh", overflowY: "scroll" }}
            >
              <CodeEditor
                renderValidationDecorations={"off"}
                handleEditorChange={handleEditorChange}
                CodeOfEditor={CodeValue}
                height={"40vh"}
                defaultLanguage={"typescript"}
                readOnly={true}
                fontSize={16}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
export default Admin;
