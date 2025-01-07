import { useState, useEffect } from "react";
import { string } from "yup";

function Admin() {
  const [ShowModel, setShowModel] = useState(false);
  const handleCloseModel = () => {
    setShowModel(false);
  };
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
    timeComplexity: null,
    spaceComplexity: null,
    companies: null,
    like: null,
    dislike: null,
    testcases: null,
    constraint: null,
    topic: null,
    accepted: null,
    submission: null,
    contestProblem: null,
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
    timeComplexity: false,
    spaceComplexity: false,
    companies: false,
    like: false,
    dislike: false,
    testcases: false,
    constraint: false,
    topic: false,
    accepted: false,
    submission: false,
    contestProblem: false,
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
        timeComplexity: true,
        spaceComplexity: true,
        companies: true,
        like: true,
        dislike: true,
        testcases: true,
        constraint: true,
        topic: true,
        accepted: true,
        submission: true,
        status: true,
        contestProblem: true,
        sampleInputOutput: true,
      });
    } else if (e === "btn5") {
      setModelHeading("Update Problem");
      setDisplayField({
        ...initialDisplayValue,
        problemNo: true,
        problemName: true,
        description: true,
        timeComplexity: true,
        spaceComplexity: true,
        companies: true,
        like: true,
        dislike: true,
        testcases: true,
        constraint: true,
        topic: true,
        accepted: true,
        submission: true,
        status: true,
        contestProblem: true,
        sampleInputOutput: true,
      });
    } else if (e === "btn6") {
      setModelHeading("Delete Problem");
      setDisplayField({
        ...initialDisplayValue,
        problemNo: true,
      });
    }
  };
  const abc = "";
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
    let { contestName, duration, startTime, problems, status } = ModalFieldData;
    if (
      contestName === null ||
      duration === null ||
      startTime === null ||
      problems === null ||
      status === null
    ) {
      return alert("Failed to create constest");
    }
    const problemsData = (problems as string).split(",");
    problemsData.map((value) => {
      return Number(value);
    });
    try {
      const response = await fetch(`http://localhost:8000/api/contest/create`, {
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
      console.log(jsondata);
    } catch (error) {
      console.log(error);
    }
  };
  function handleSendQuery() {
    if (ModelHeading === "Create Contest") {
      handleCreateContest();
    }
  }

  return (
    <>
      <div
        className="modal fade"
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
                      DisplayField.timeComplexity ? "d-block" : "d-none"
                    }`}
                  >
                    <label htmlFor="name" className="col-form-label">
                      Time Complexity:
                    </label>
                    <input
                      type="text"
                      value={ModalFieldData.timeComplexity || ""}
                      name="timeComplexity"
                      onChange={handleFieldValueChange}
                      className="form-control"
                      id=""
                    />
                  </div>
                  <div
                    className={`mb-3 ${
                      DisplayField.spaceComplexity ? "d-block" : "d-none"
                    }`}
                  >
                    <label htmlFor="name" className="col-form-label">
                      Space Complexity:
                    </label>
                    <input
                      type="text"
                      value={ModalFieldData.spaceComplexity || ""}
                      name="spaceComplexity"
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
                      DisplayField.contestProblem ? "d-block" : "d-none"
                    }`}
                  >
                    <label htmlFor="name" className="col-form-label">
                      Contest Problem:
                    </label>
                    <input
                      type="text"
                      value={ModalFieldData.contestProblem || ""}
                      name="contestProblem"
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
            <button className="m-2 btn btn-success">Get All Contest</button>
            <button className="m-2 btn btn-success">
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
            <button className="m-2 btn btn-success">{ModelHeading}</button>
            <button className="m-2 btn btn-success">
              Get Specific Problem
            </button>
          </div>
          <div className="">
            <button className="m-2 btn btn-light">Clear All</button>
          </div>
          <div></div>
        </div>
      </div>
    </>
  );
}
export default Admin;
