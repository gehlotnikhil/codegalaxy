import { Link } from 'react-router-dom'

function AppNavbar() {
  return (
    <>
      <nav className="navbar navbar-expand-lg bg-body-tertiary bg-nav" >
        <div className="container-fluid">
          <img className='nav-item me-3' src="./logo.png" height={"40px"} width={"40px"} alt="" />
          <Link className=" navbar-brand " to="/" style={{fontWeight:"600"}}><span style={{ color: "rgb(0 109 255)" }}>Code</span><span style={{ color: "#FCB040" }}>Galaxy</span></Link>
          <div className="collapse navbar-collapse white" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0 ">
              <li className="nav-item">
                <Link className="white nav-link active white" aria-current="page" to="/">Home</Link>
              </li>
              <li className="nav-item">
                <Link className="white nav-link" to="/">About</Link>
              </li>
            </ul>


            <div className="d-flex " >
              <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                <li className="nav-item">
                  <Link className="white nav-link "  to="/login">Login</Link>
                </li>
                <li className="nav-item">
                  <Link className="white nav-link" to="/signup">Sign Up</Link>
                </li>
              </ul>     
               </div>
          </div>
        </div>
      </nav>
    </>
  );
}

export default AppNavbar;