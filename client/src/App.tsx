import "./App.css";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom"; // Ensure this is `react-router-dom`
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
import {setUserDetail} from './store/slice/UserDetailSlice'
const ProtectedRoute: React.FC<{ children: React.ReactNode; }> = ({
  children
}) => {
  const rootState = useSelector((state: RootStateType) => {
    return state;
  });
  const navigate = useNavigate();
  const isAuthenticated = rootState.userDetail.token !== null;

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
    console.log("rock----", rootState.userDetail);
    console.log("aaaa--------------", rootState.userDetail.role?.Admin);
    if(rootState.userDetail.role?.Admin===true){
      navigate("/admin")
    }
    if(rootState.userDetail.role?.Admin===false && location.pathname === "/admin"){
      navigate("/")
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) {
    // Optionally render a loading spinner or null while checking
    return null;
  }
  return <>{children}</>; // Render children only if condition passes
};

function App() {
 const dispatch = useDispatch()
 const rootState = useSelector((state: RootStateType) => {
  return state;
});
  const user = JSON.parse(localStorage.getItem("User") || "null");

  const defaultProfilePicture =
    "https://res.cloudinary.com/diqpelkm9/image/upload/f_auto,q_auto/k4s9mgdywuaasjuthfxk";
  const [initialProfilePicture, setinitialProfilePicture] = useState(
    defaultProfilePicture
  );
  useEffect(() => {
    console.log("Changed picture-", initialProfilePicture);
  }, [initialProfilePicture]);

  const [profilePicture, setProfilePicture] = useState<File>(
    new File([""], "filename")
  );

  const ChangeCodeEditorDesign = () => {};
  const [Demo, setDemo] = useState("hello world");
  const [CodeOfEditor, setCodeOfEditor] = useState(``);
  const handleEditorChange = (value: string | undefined) => {
    setCodeOfEditor(value || "");
  };
  useEffect(() => {
    console.log(CodeOfEditor);
  }, [CodeOfEditor]);

  const [ShowEditProfile, setShowEditProfile] = useState(false);
  const [ShowProfile, setShowProfile] = useState(true);
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

  useEffect(() => {
    console.log("ShowEditProfile-", ShowEditProfile);
  }, [ShowEditProfile]);
  useEffect(() => {
    console.log("ShowProfile-", ShowProfile);
  }, [ShowProfile]);
  const updateProfileInformation = async (data: any) => {
    const result = await fetch("http://localhost:8000/api/user/update/", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token: rootState.userDetail.token,
        ...data,
      }),
    });
    const jsondata = await result.json();
    console.log(jsondata);
    if(jsondata.success){
      console.log("go--------------------------",jsondata);
      
    dispatch(setUserDetail(jsondata.result))
    alert("Updated")
    }
  };

  return (
    <>
      <MainContext.Provider
        value={{
          updateProfileInformation,
          setShowProfile,
          setShowEditProfile,
          ShowEditProfile,
          ShowProfile,
          handleShowProfileToggle,
          initialProfilePicture,
          setinitialProfilePicture,
          handleEditorChange,
          setCodeOfEditor,
          CodeOfEditor,
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
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="*" element={<Error />} />

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
              path="/admin"
              element={
                <ProtectedRoute >
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
              path="/profile"
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
                <ProtectedRoute>
                  <Testing1 />
                </ProtectedRoute>
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
          </Routes>
        </BrowserRouter>
      </MainContext.Provider>
    </>
  );
}

export default App;
