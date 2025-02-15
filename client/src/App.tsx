import "./App.css";
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
  useNavigate,
} from "react-router-dom"; // Ensure this is `react-router-dom`
import Login from "./Component/Login";
import AppNavbar from "./Component/Navbar";
import SignUp from "./Component/SignUp";
import Home from "./Component/Home";
import About from "./Component/About";
import Error from "./Component/Error";
import Admin from "./Component/Admin";
import MainContext from "./context/main";
import { useState, useEffect } from "react";
import Profile from "./Component/Profile";
import EditProfile from "./Component/EditProfile";
import UploadPage from "./Component/UploadPage";
import DisplayPage from "./Component/DisplayPage";
import Testing1 from "./Component/Testing1";
import { useDispatch, useSelector } from "react-redux";
import { RootStateType } from "./store";
import { setUserDetail } from "./store/slice/UserDetailSlice";
import PlayGround from "./Component/PlayGround";
import { toast } from "react-toastify";
import ProblemPage from "./Component/ProblemSetArea";
import LoadingComponent from "./Component/Loading";
import PraticeCourseArena from "./Component/PraticeCourseArena";
import SolvedPraticeProblem from "./Component/SolvedPraticeProblem";
import OTPVerification from "./Component/OTPVerification";
import ForgetPassword from "./Component/ForgetPassword";
import ContestMainPage from "./Component/ContestMainPage";
import ContestProblemPage from "./Component/ContestProblemPage";
import ContestCodingArena from "./Component/ContestCodingArena";
import OneToOneCompete from "./Component/OneToOneCompete";
import OneToOneCompeteSpinner from "./Component/OneToOneCompeteSpinner";
import OneToOneCodeEditor from "./Component/OneToOneCodeEditor";
interface ProtectedRouteProps {
  children: React.ReactNode;
} 
// const SERVER_URL = "http://localhost:8000";
const SERVER_URL = "https://codegalaxy-server.onrender.com";
const WEBSOCKET_URL = "wss://codegalaxy-onetoonecompete-ws.onrender.com"
// const WEBSOCKET_URL = "ws://localhost:8080"
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const userDetail = useSelector((state: RootStateType) => state.userDetail);

  const [loading, setLoading] = useState(true);
  const [redirectComponent, setRedirectComponent] =
    useState<React.ReactNode>(null);
  useEffect(() => {
    try {
      console.log("SERVER_URL-", process.env.SERVER_URL || 1);
    } catch (error) {}
  }, []);
  const loadDataTokenToUserDetail = async (
    token: string | null
  ): Promise<boolean> => { 
    try {
      const response = await fetch(`${SERVER_URL}/api/user/tokentodata`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
      });

      const jsonData = await response.json();
      console.log("Token validation response:", jsonData);

      if (jsonData.success) {
        dispatch(setUserDetail({ ...jsonData.result, token }));
        return true;
      }
    } catch (error) {
      console.error("Error verifying token:", error);
    }
    return false;
  };

  const verifyAuthentication = async (): Promise<React.ReactNode> => {
    const token = localStorage.getItem("token");

    if (!userDetail.token && token) {
      const success = await loadDataTokenToUserDetail(token);
      console.log("Token loaded successfully:", success);

      if (!success) {
        console.log("Navigating to Login due to unsuccessful token loading");
        navigate("/login");
        return <Login />;
      }
    } else if (!userDetail.token) {
      console.log("No token found, redirecting to Login");
      navigate("/login");
      return <Login />;
    }

    if (userDetail.isAdmin && location.pathname !== "/admin") {
      navigate("/admin");
      return <Admin />;
    } else if (!userDetail.isAdmin && location.pathname === "/admin") {
      navigate("/");
      return <Home />;
    }

    return children; // Render the protected content
  };

  useEffect(() => {
    const authenticate = async () => {
      const componentToRender = await verifyAuthentication();
      setRedirectComponent(componentToRender);
      setLoading(false);
    };

    authenticate();
  }, [userDetail.token, location.pathname, dispatch]);

  if (loading) {
    return <LoadingComponent />; // Optionally show a loading spinner
  }

  return <>{redirectComponent}</>;
};

function App() {
  const dispatch = useDispatch();
  const userDetail = useSelector((state: RootStateType) => state.userDetail);
  const defaultProfilePicture =
    "https://res.cloudinary.com/diqpelkm9/image/upload/f_auto,q_auto/k4s9mgdywuaasjuthfxk";

  const [initialProfilePicture, setinitialProfilePicture] = useState(
    defaultProfilePicture
  );
  const [profilePicture, setProfilePicture] = useState<File>(
    new File([""], "filename")
  );
  const [Demo, setDemo] = useState("hello world");
  const [ShowEditProfile, setShowEditProfile] = useState(false);
  const [ShowProfile, setShowProfile] = useState(true);
  useEffect(() => {
    console.log("Changed picture-", initialProfilePicture);
  }, [initialProfilePicture]);

  useEffect(() => {
    console.log("ShowEditProfile-", ShowEditProfile);
  }, [ShowEditProfile]);
  useEffect(() => {
    console.log("ShowProfile-", ShowProfile);
  }, [ShowProfile]);

  const ChangeCodeEditorDesign = () => {};

  function handleShowProfileToggle(): void {
    if (ShowEditProfile === true) {
      setShowEditProfile(false);
    } else {
      setShowEditProfile(true);
    }
    if (ShowProfile === true) {
      setShowProfile(false);
    } else {
      setShowProfile(true);
    }
  }
  const updateProfileInformation = async (data: any) => {
    console.log("updateProfileInformation-", data);
    console.log("token -", userDetail.token);

    const result = await fetch(`${SERVER_URL}/api/user/update/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token: userDetail.token,
        ...data,
      }),
    });
    const jsondata = await result.json();
    console.log(jsondata);
    if (jsondata.success) {
      console.log("go--------------------------", jsondata);

      dispatch(setUserDetail(jsondata.result));
      toast("Updated");
    } else {
      toast("Not Updated");
    }
  };
  const handleCodeExecution = async (data: any) => {
    const result = await fetch(`${SERVER_URL}/api/problemset/executeproblem`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...data,
      }),
    });
    const jsondata = await result.json();
    return jsondata;
  };

  return (
    <>
      <MainContext.Provider
        value={{
          WEBSOCKET_URL,
          handleCodeExecution,
          SERVER_URL,
          updateProfileInformation,
          setShowProfile,
          setShowEditProfile,
          ShowEditProfile,
          ShowProfile,
          handleShowProfileToggle,
          initialProfilePicture,
          setinitialProfilePicture,
          Demo,
          setDemo,
          ChangeCodeEditorDesign,
          profilePicture,
          setProfilePicture,
          defaultProfilePicture,
        }}
      >
        <BrowserRouter>
          <AppNavbar />
          <Routes>
            {/* Public Routes */}
            <Route
              path="/login"
              element={
                // <ProtectedRoute>
                  <Login />
                // </ProtectedRoute>
              }
            />
            <Route
              path="/forget-password"
              element={
                // <ProtectedRoute>
                  <ForgetPassword />
                // </ProtectedRoute>
              }
            />
            <Route
              path="/signup"
              element={
                // <ProtectedRoute>
                  <SignUp />
                // </ProtectedRoute>
              }
            />

            <Route
              path="/problem/:problemid"
              element={
                <ProtectedRoute>
                  <ProblemPage />
                </ProtectedRoute>
              }
            />

            <Route path="*" element={<Error />} />
            <Route
              path="/playground"
              element={
                <ProtectedRoute>
                  <PlayGround />
                </ProtectedRoute>
              }
            />

            {/* Protected Routes */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              }
            />
            <Route
              path="/onetoonecompete"
              element={
                <ProtectedRoute>
                  <OneToOneCompete />
                </ProtectedRoute>
              }
            />
            <Route
              path="/findopponent"
              element={
                <ProtectedRoute>
                  <OneToOneCompeteSpinner />
                </ProtectedRoute>
              }
            />
            <Route
              path="/codeonetoone"
              element={
                <ProtectedRoute>
                  <OneToOneCodeEditor />
                </ProtectedRoute>
              }
            />
            <Route
              path="/contest"
              element={
                <ProtectedRoute>
                  <ContestMainPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/contest/:contestId"
              element={
                <ProtectedRoute>
                  <ContestProblemPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/contest/:contestid/:problemid"
              element={
                <ProtectedRoute>
                  <ContestCodingArena />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <Admin />
                </ProtectedRoute>
              }
            />
            <Route
              path="/about"
              element={
                <ProtectedRoute>
                  <About />
                </ProtectedRoute>
              }
            />
            <Route
              path="/u/:username"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/test"
              element={
                <ProtectedRoute>
                  <EditProfile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/test2"
              element={
                // <ProtectedRoute>
                <Testing1 />
                // <Hero />
                // {/* </ProtectedRoute> */}
              }
            />
            <Route
              path="/verify"
              element={
                // <ProtectedRoute>
                <OTPVerification />
                // <Hero />
                // {/* </ProtectedRoute> */}
              }
            />
            <Route
              path="/upload"
              element={
                <ProtectedRoute>
                  <UploadPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/display"
              element={
                <ProtectedRoute>
                  <DisplayPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/edit"
              element={
                <ProtectedRoute>
                  <EditProfile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/pratice/:course"
              element={
                <ProtectedRoute>
                  <PraticeCourseArena />
                </ProtectedRoute>
              }
            />
            <Route
              path="/pratice/:course/:problemid"
              element={
                <ProtectedRoute>
                  <SolvedPraticeProblem />
                </ProtectedRoute>
              }
            />
          </Routes>
        </BrowserRouter>
      </MainContext.Provider>
    </>
  );
}

export default App;
