import { useState, useEffect } from "react";

function Admin() {
  const [ModelHeading, setModelHeading] = useState("");
  const handleChangeModelHeading = (e: string): any => {
    if (e === "btn1") setModelHeading("Create Contest");
    else if (e === "btn2") setModelHeading("Update Contest");
    else if (e === "btn3") setModelHeading("Delete Contest");
    else if (e === "btn4") setModelHeading("Create Problem");
    else if (e === "btn5") setModelHeading("Update Problem");
    else if (e === "btn6") setModelHeading("Delete Problem");
  };
  useEffect(() => {
    console.log("ModelHeading updated:", ModelHeading);
  }, [ModelHeading]);
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
                  <div className="mb-3">
                    <label htmlFor="name" className="col-form-label">
                      Contest No:
                    </label>
                    <input type="text" className="form-control" id="" />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="name" className="col-form-label">
                      Contest Name:
                    </label>
                    <input type="text" className="form-control" id="" />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="name" className="col-form-label">
                      Duration:
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="recipient-name"
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="name" className="col-form-label">
                      Start Time:
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="recipient-name"
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="name" className="col-form-label">
                      Problems:
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="recipient-name"
                    />
                  </div>
                </div>
                <div className="problem">
                  <div className="mb-3">
                    <label htmlFor="name" className="col-form-label">
                      Problem No:
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="recipient-name"
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="name" className="col-form-label">
                      Problem Name:
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="recipient-name"
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="name" className="col-form-label">
                      Describtion:
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="recipient-name"
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="name" className="col-form-label">
                    Time Complexity:
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="recipient-name"
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="name" className="col-form-label">
                    Space Complexity:
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="recipient-name"
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="name" className="col-form-label">
                    Like:
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="recipient-name"
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="name" className="col-form-label">
                    DisLike:
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="recipient-name"
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="name" className="col-form-label">
                    Constraints:
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="recipient-name"
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="name" className="col-form-label">
                    Topic:
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="recipient-name"
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="name" className="col-form-label">
                    Accepted:
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="recipient-name"
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="name" className="col-form-label">
                    Submission:
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="recipient-name"
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="name" className="col-form-label">
                    Status:
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="recipient-name"
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="name" className="col-form-label">
                    Contest Problem:
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="recipient-name"
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="name" className="col-form-label">
                    TestCases:
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="recipient-name"
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="name" className="col-form-label">
                    Sample Input Output:
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="recipient-name"
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
              >
                Close
              </button>
              <button type="button" className="btn btn-primary">
                Send message
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="color-1 ">
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
          <button className="m-2 btn btn-success">Get Specific Contest</button>
        </div>
        <div>
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
          <button className="m-2 btn btn-success">Get Specific Problem</button>
        </div>
        <div>
          <button className="m-2 btn btn-light">Clear All</button>
        </div>
        <div></div>
      </div>
    </>
  );
}
export default Admin;
