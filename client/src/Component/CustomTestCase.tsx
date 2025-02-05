import  { useEffect, useState } from 'react'

function CustomTestCase() {
    const [showUserTestCase, setShowUserTestCase] = useState(false)
    useEffect(() => {
        console.log(showUserTestCase);
    }, [showUserTestCase])

    

  return (
    <>
    <div className="container mt-3">
            <div className="card">
              <div className="card-header bg-dark text-light d-flex justify-content-between">
                <span>Custom Testcase</span>
                <span className="" >
                  <svg
                  className={`d-${showUserTestCase?"inline":"none"}`}
                    width="25"
                    height="25"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    onClick={()=>setShowUserTestCase(false)}>
                    <rect width="24" height="24" rx="4" fill="#333" />
                    <path
                      d="M6 15l6-6 6 6"
                      stroke="gray"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                  <svg
                    className={`d-${!showUserTestCase?"inline":"none"}`}
                    width="25"
                    height="25"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    onClick={()=>setShowUserTestCase(true)}>
                    <rect width="24" height="24" rx="4" fill="#333" />
                    <path
                      d="M6 9l6 6 6-6"
                      stroke="gray"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </span>
              </div>
              <div className={`card-body d-${showUserTestCase?"block":"none"}`} >
                <div className="mt-3">
                  <label className="form-label">Input</label>
                  <input
                    type="text"
                    className="form-control"
                  />
                </div>
                <div className="mt-3">
                  <label className="form-label">Output</label>
                  <textarea
                    className="form-control"
                    disabled
                  ></textarea>
                </div>
                <div className="mt-3">
                  <label className="form-label">Expected Output</label>
                  <input
                    type="text"
                    className="form-control"
                    disabled
                  />
                </div>
              </div>
              </div>
              </div>
    
    </>
  )
}

export default CustomTestCase;