import { Link } from 'react-router-dom'
function Error() {
  return (
    <>
   <div className="d-flex align-items-center justify-content-center vh-100 color-1">
            <div className="text-center">
                <h1 className="display-1 fw-bold">404</h1>
                <p className="fs-3"> <span className="text-danger">Opps!</span> Page not found.</p>
                <p className="lead">
                    The page you're looking for doesn't exist.
                  </p>
                <Link to="/" className="btn btn-primary">Go Home</Link>
            </div>
        </div>
    </>
  )
}

export default Error