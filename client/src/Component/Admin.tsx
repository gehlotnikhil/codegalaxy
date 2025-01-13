import { useState } from "react";
import CodeEditor from "./CodeEditor";
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

  const { Demo, setDemo, ServerUrl } = context;
  useEffect(() => {
    console.log("demo-", Demo);
  }, [Demo]);

  interface InOutTestCase {
    input: string;
    output: string;
  }

  interface ProblemSet {
    problemNo?: string;
    problemName?: string;
    description?: string;
    companies?: String[];
    like?: Number;
    dislike?: Number;
    testcases?: InOutTestCase[];
    constraint?: String[];
    topic?: String[];
    accepted?: Number;
    submission?: Number;
    status?: "UNSOLVED" | "SOLVED";
    category?: "ALGORITHMS" | "AI" | "CONCURRANCY";
    sampleInputOutput?: InOutTestCase[];
  }

  const initialModelFieldData = {
    contestNo: null,
    contestName: null,
    duration: null,
    startTime: null,
    problems: null,
    status: null,
    problemNo: null,
    problemName: null,
    description: null,
    companies: null,
    like: null,
    dislike: null,
    testcases: null,
    constraint: null,
    topic: null,
    accepted: null,
    category: null,
    submission: null,
    sampleInputOutput: null,
  };
  const [ModalFieldData, setModalFieldData] = useState(initialModelFieldData);

  const [ModelHeading, setModelHeading] = useState("");
  const initialDisplayValue = {
    contestNo: false,
    contestName: false,
    duration: false,
    startTime: false,
    problems: false,
    status: false,
    problemNo: false,
    problemName: false,
    description: false,
    companies: false,
    like: false,
    dislike: false,
    testcases: false,
    constraint: false,
    topic: false,
    accepted: false,
    category: false,
    submission: false,
    sampleInputOutput: false,
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
        problemName: true,
        description: true,
        companies: true,
        like: true,
        dislike: true,
        testcases: true,
        constraint: true,
        topic: true,
        accepted: true,
        category: true,
        submission: true,
        status: true,
        sampleInputOutput: true,
      });
    } else if (e === "btn5") {
      setModelHeading("Update Problem");
      setDisplayField({
        ...initialDisplayValue,
        problemNo: true,
        problemName: true,
        description: true,
        companies: true,
        like: true,
        dislike: true,
        testcases: true,
        constraint: true,
        topic: true,
        accepted: true,
        category: true,
        submission: true,
        status: true,
        sampleInputOutput: true,
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
    let { contestName, duration, startTime, problems, status } = ModalFieldData;
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
      const response = await fetch(`${ServerUrl}/api/contest/create`, {
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
        `${ServerUrl}/api/contest/update/${contestNo}`,
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
        `${ServerUrl}/api/contest/delete/${contestNo}`,
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
      problemName,
      description,
      companies,
      like,
      dislike,
      testcases,
      constraint,
      topic,
      accepted,
      submission,
      category,
      status,
      sampleInputOutput,
    } = ModalFieldData;
    if (
      accepted === null ||
      category === null ||
      companies === null ||
      problemName === null ||
      description === null ||
      like === null ||
      dislike === null ||
      testcases === null ||
      constraint === null ||
      topic === null ||
      submission === null ||
      status === null ||
      sampleInputOutput === null
    ) {
      return toast.error("Failed to create problem");
    }
    const bodyData: ProblemSet = {
      problemName,
      description,
      companies: (companies as string).split(","),
      like: Number(like),
      dislike: Number(dislike),
      testcases: JSON.parse(testcases),
      constraint: (constraint as string).split(","),
      topic: (topic as string).split(","),
      accepted: Number(accepted),
      category,
      submission: Number(submission),
      status,
      sampleInputOutput: JSON.parse(sampleInputOutput),
    };

  
      const response = await fetch(`${ServerUrl}/api/problemset/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bodyData),
      });
      const jsondata = await response.json();
      if(jsondata.success){
        toast.success("Problem created successfully");
      }else{
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
      like,
      dislike,
      testcases,
      constraint,
      topic,
      accepted,
      category,
      submission,
      status,
      sampleInputOutput,
    } = ModalFieldData;
    if (problemNo === null) {
      return toast.error("Failed to update problem");
    }
    let bodyData: ProblemSet = {};
    // let problemsData = problems
    //   ? (problems as string).split(",").map((value) => Number(value))
    //   : [];
    if (problemName !== null) bodyData.problemName = problemName;
    if (description !== null) bodyData.description = description;
    if (companies !== null)
      bodyData.companies = (companies as string).split(",");
    if (like !== null) bodyData.like = Number(like);
    if (dislike !== null) bodyData.dislike = Number(dislike);
    if (testcases !== null) bodyData.testcases = JSON.parse(testcases);
    if (constraint !== null)
      bodyData.constraint = (constraint as string).split(",");
    if (topic !== null) bodyData.topic = (topic as string).split(",");
    if (accepted !== null) bodyData.accepted = Number(accepted);
    if (submission !== null) bodyData.submission = Number(submission);
    if (sampleInputOutput !== null)
      bodyData.sampleInputOutput = JSON.parse(sampleInputOutput);
    if (status !== null) bodyData.status = status;
    if (category !== null) bodyData.category = category;
    console.log(bodyData);
    try {
      const response = await fetch(
        `${ServerUrl}/api/problemset/update/${problemNo}`,
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
        `${ServerUrl}/api/problemset/delete/${problemNo}`,
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
        `${ServerUrl}/api/problemset/getallproblem`,
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
  const handleGetSpecificProblem = async () => {
    let { problemNo } = ModalFieldData;
    if (problemNo === null) {
      return toast.error("failed to fetch specific contest");
    }
    try {
      const response = await fetch(
        `${ServerUrl}/api/problemset/getspecificproblem?no=${problemNo}`,
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
  const handleGetAllContest = async () => {
    try {
      const response = await fetch(`${ServerUrl}/api/contest/getallcontest`, {
        method: "GET",
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
        `${ServerUrl}/api/contest/getspecificcontest?no=${contestNo}`,
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
      <div
        style={{}}
        className="modal fade text-dark"
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
                      DisplayField.like ? "d-block" : "d-none"
                    }`}
                  >
                    <label htmlFor="name" className="col-form-label">
                      Like:
                    </label>
                    <input
                      type="text"
                      value={ModalFieldData.like || ""}
                      name="like"
                      onChange={handleFieldValueChange}
                      className="form-control"
                      id=""
                    />
                  </div>
                  <div
                    className={`mb-3 ${
                      DisplayField.dislike ? "d-block" : "d-none"
                    }`}
                  >
                    <label htmlFor="name" className="col-form-label">
                      DisLike:
                    </label>
                    <input
                      type="text"
                      value={ModalFieldData.dislike || ""}
                      name="dislike"
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
                      DisplayField.accepted ? "d-block" : "d-none"
                    }`}
                  >
                    <label htmlFor="name" className="col-form-label">
                      Accepted:
                    </label>
                    <input
                      type="text"
                      value={ModalFieldData.accepted || ""}
                      name="accepted"
                      onChange={handleFieldValueChange}
                      className="form-control"
                      id=""
                    />
                  </div>
                  <div
                    className={`mb-3 ${
                      DisplayField.submission ? "d-block" : "d-none"
                    }`}
                  >
                    <label htmlFor="name" className="col-form-label">
                      Submission:
                    </label>
                    <input
                      type="text"
                      value={ModalFieldData.submission || ""}
                      name="submission"
                      onChange={handleFieldValueChange}
                      className="form-control"
                      id=""
                    />
                  </div>
                  <div
                    className={`mb-3 ${
                      DisplayField.status ? "d-block" : "d-none"
                    }`}
                  >
                    <label htmlFor="name" className="col-form-label">
                      Status:
                    </label>
                    <input
                      type="text"
                      value={ModalFieldData.status || ""}
                      name="status"
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
            className="codeeditor mt-4"
            style={{ maxHeight: "50vh", boxSizing: "border-box" }}
          >
            <CodeEditor
              renderValidationDecorations={"off"}
              handleEditorChange={handleEditorChange}
              CodeOfEditor={CodeValue}
              height={"60%"}
              defaultLanguage={"typescript"}
              readOnly={true}
              fontSize={16}
            />
          </div>
        </div>
      </div>
    </>
  );
}
export default Admin;
