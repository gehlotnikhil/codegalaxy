import { useContext, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import MainContext from "../context/main";
import { useSelector } from "react-redux";
import { RootStateType } from "../store";

function AppNavbar() {
  const locationHook = useLocation()
  const context = useContext(MainContext);
  const userDetails = useSelector((state: RootStateType) => {
    return state.userDetail;
  });
  const { defaultProfilePicture } = context;
  function handleClickSignOut(): void {
    console.log("hi--");
    localStorage.setItem("User", "null");
  }
  const [NavbarLinkStatus, setNavbarLinkStatus] = useState({
    loginLink: true,
    signupLink: true,
    homeLink: true,
    aboutLink: true,
    profileIcon: true,
    prfileLink:true,
    playgroundLink:true

  });
  
  useEffect(() => {
    const updatedStatus = {
      loginLink: true,
      signupLink: true,
      homeLink: true,
      aboutLink: true,
      profileIcon: true,
      prfileLink:true,
      playgroundLink:true
    };

    if (locationHook.pathname === "/login") {
      updatedStatus.homeLink = false;
      updatedStatus.aboutLink = false;
      updatedStatus.loginLink = false;
      updatedStatus.profileIcon = false;
      updatedStatus.prfileLink = false
      updatedStatus.playgroundLink = false
    } else if (locationHook.pathname === "/signup") {
      updatedStatus.homeLink = false;
      updatedStatus.aboutLink = false;
      updatedStatus.signupLink = false;
      updatedStatus.profileIcon = false;
      updatedStatus.prfileLink = false
      updatedStatus.playgroundLink = false


    } else if (locationHook.pathname === "/admin") {
      updatedStatus.homeLink = false;
      updatedStatus.aboutLink = false;
      updatedStatus.loginLink = false;
      updatedStatus.signupLink = false;
      updatedStatus.profileIcon = true;
      updatedStatus.prfileLink = false
      updatedStatus.playgroundLink = false

    } else {
      updatedStatus.loginLink = false;
      updatedStatus.playgroundLink = true
      updatedStatus.signupLink = false;
    }
console.log("i an in",updatedStatus);

    setNavbarLinkStatus(updatedStatus);
  }, [locationHook]);

  useEffect(() => {
    console.log(NavbarLinkStatus);
    
  }, [NavbarLinkStatus])
  
  
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
              <li className={`nav-item d-${NavbarLinkStatus.homeLink ===true?"inline":"none"}`}>
                <Link
                  className="white nav-link active white"
                  aria-current="page"
                  to="/"
                >
                  Home
                </Link>
              </li>
              <li className={`nav-item d-${NavbarLinkStatus.aboutLink ===true?"inline":"none"}`}>
                <Link className="white nav-link" to="/about">
                  About
                </Link>
              </li>
             
            </ul>

            <div className="d-flex ">
              <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className={`nav-item d-${NavbarLinkStatus.loginLink ===true?"inline":"none"}`}>
                  <Link className="white nav-link " to="/login">
                    Login
                  </Link>
                </li>
                <li className={`nav-item d-${NavbarLinkStatus.signupLink ===true?"inline":"none"}`}>
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
              className={`btn btn-secondary profile-icon d-${NavbarLinkStatus.profileIcon ===true?"inline":"none"}`}
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              NG
            </button>
            <ul className="dropdown-menu">
              <li>
                <img
                  style={{ height: "43px",width:"48px", marginLeft: "5px" }}
                  // src="./profilePicture.png"
                  src={`${
                    userDetails.profilePictureUrl === defaultProfilePicture
                      ? defaultProfilePicture
                      : userDetails.profilePictureUrl
                  }`}
                  alt=""
                  srcSet=""
                />{" "}
                <span style={{ marginLeft: "5px" }}>Nikhil Gehlot</span>
              </li>
              <hr style={{ margin: "0" }} className="my-2" />
              <li style={{ display: "flex", alignItems: "center" }} className={`d-${NavbarLinkStatus.prfileLink===true?"inline":"none"}`}>
                <Link className="dropdown-item" to="/profile">
                  Profile
                </Link>
              </li>
              <li className={` d-${NavbarLinkStatus.playgroundLink ===true?"inline":"none"}`}>
                <Link  className="dropdown-item"  to="/playground">
                  PlayGround
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
