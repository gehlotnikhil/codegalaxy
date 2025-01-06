import { useState,useEffect } from "react";

function Admin() {
  const [ModelHeading, setModelHeading] = useState("");
 const handleChangeModelHeading = (e:string):any=>{
  if(e==="btn2")
    setModelHeading("hi")
}
 useEffect(() => {
  console.log("ModelHeading updated:", ModelHeading);
}, [ModelHeading]);
  return (
    <>

      <div className="modal fade" id="exampleModal" tabIndex={-1} aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">{ModelHeading}</h1>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <form>
                <div className="mb-3">
                  <label htmlFor="recipient-name" className="col-form-label">Recipient:</label>
                  <input type="text" className="form-control" id="recipient-name" />
                </div>
                <div className="mb-3">
                  <label htmlFor="message-text" className="col-form-label">Message:</label>
                  <textarea className="form-control" id="message-text"></textarea>
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              <button type="button" className="btn btn-primary">Send message</button>
            </div>
          </div>
        </div>
      </div>
      <div className="color-1 ">
        <div>
          <h2>Contest:</h2>
          <button type="button" onClick={(e)=>setModelHeading(()=>(e.target as HTMLButtonElement).value)}  data-bs-toggle="modal" data-bs-target="#exampleModal" data-bs-whatever="@getbootstrap" className="m-2 btn btn-warning">Create Contest</button>
          <button type="button" onClick={()=>{handleChangeModelHeading("btn2")}}  data-bs-toggle="modal" data-bs-target="#exampleModal" data-bs-whatever="@getbootstrap" className="m-2 btn btn-primary">Update Contest</button>
          <button type="button" onClick={()=>{handleChangeModelHeading("btn3")}}  data-bs-toggle="modal" data-bs-target="#exampleModal" data-bs-whatever="@getbootstrap" className="m-2 btn btn-danger">Delete Contest</button>
          <button  className="m-2 btn btn-success">Get All Contest</button>
          <button  className="m-2 btn btn-success">Get Specific Contest</button>
        </div>
        <div>
          <h2>Problem:</h2>
          <button type="button" onClick={()=>{handleChangeModelHeading("btn4")}}  data-bs-toggle="modal" data-bs-target="#exampleModal" data-bs-whatever="@getbootstrap" className="m-2 btn btn-warning">Create Problem</button>
          <button type="button" onClick={()=>{handleChangeModelHeading("btn5")}}  data-bs-toggle="modal" data-bs-target="#exampleModal" data-bs-whatever="@getbootstrap" className="m-2 btn btn-primary">Update Problem</button>
          <button type="button" onClick={()=>{handleChangeModelHeading("btn6")}}  data-bs-toggle="modal" data-bs-target="#exampleModal" data-bs-whatever="@getbootstrap" className="m-2 btn btn-danger">Delete Problem</button>
          <button  className="m-2 btn btn-success">{ModelHeading}</button>
          <button  className="m-2 btn btn-success">Get Specific Problem</button>
        </div>
        <div>
          <button className="m-2 btn btn-light">Clear All</button>
        </div>
        <div>

        </div>
      </div>
    </>
  )
}
export default Admin