

function Admin() {
    return (
        <>
            <div className="color-1 ">
                <div>
                    <h2>Contest:</h2>
                    <button className="m-2 btn btn-warning">Create Contest</button>
                    <button className="m-2 btn btn-primary">Update Contest</button>
                    <button className="m-2 btn btn-danger">Delete Contest</button>
                    <button className="m-2 btn btn-success">Get All Contest</button>
                    <button className="m-2 btn btn-success">Get Specific Contest</button>
                </div>
                <div>
                    <h2>Problem:</h2>
                    <button className="m-2 btn btn-warning">Create Problem</button>
                    <button className="m-2 btn btn-primary">Update Problem</button>
                    <button className="m-2 btn btn-danger">Delete Problem</button>
                    <button className="m-2 btn btn-success">Get All Problem</button>
                    <button className="m-2 btn btn-success">Get Specific Problem</button>
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