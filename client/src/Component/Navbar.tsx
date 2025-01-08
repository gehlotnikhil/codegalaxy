import { Link } from "react-router-dom";

function AppNavbar() {
  function handleClickSignOut(): void {
    console.log("hi--");
    localStorage.setItem("User", "null");
  }

  return (
    <>
      <nav className="navbar navbar-expand-lg bg-body-tertiary bg-nav">
        <div className="container-fluid">
          <img
            className="nav-item me-3"
            src="./logo.png"
            height={"40px"}
            width={"40px"}
            alt=""
          />
          <Link className=" navbar-brand " to="/" style={{ fontWeight: "600" }}>
            <span style={{ color: "rgb(0 109 255)" }}>Code</span>
            <span style={{ color: "#FCB040" }}>Galaxy</span>
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div
            className="collapse navbar-collapse white"
            id="navbarSupportedContent"
          >
            <ul className="navbar-nav me-auto mb-2 mb-lg-0 ">
              <li className="nav-item">
                <Link
                  className="white nav-link active white"
                  aria-current="page"
                  to="/"
                >
                  Home
                </Link>
              </li>
              <li className="nav-item">
                <Link className="white nav-link" to="/about">
                  About
                </Link>
              </li>
            </ul>

            <div className="d-flex ">
              <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                <li className="nav-item">
                  <Link className="white nav-link " to="/login">
                    Login
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="white nav-link" to="/signup">
                    Sign Up
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className={`btn-group dropstart `}>
            <button
              type="button"
              className="btn btn-secondary profile-icon"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              NG
            </button>
            <ul className="dropdown-menu">
              <li>
                <img
                  style={{ height: "43px", marginLeft: "5px" }}
                  src="./profilePicture.png"
                  alt=""
                  srcSet=""
                />{" "}
                <span style={{ marginLeft: "5px" }}>Nikhil Gehlot</span>
              </li>
              <hr style={{ margin: "0" }} className="my-2" />
              <li style={{ display: "flex", alignItems: "center" }}>
                <Link className="dropdown-item" to="/profile">
                  Profile
                </Link>
              </li>
              <li>
                <Link
                  className="dropdown-item"
                  onClick={handleClickSignOut}
                  to="/login"
                >
                  Sign out
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
}

export default AppNavbar;
