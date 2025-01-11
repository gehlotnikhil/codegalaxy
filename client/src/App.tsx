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
import PlayGround from "./Component/PlayGround";
import Demo2 from "./Component/Demo2";
import { toast } from "react-toastify";
const ProtectedRoute: React.FC<{ children: React.ReactNode; }> = ({
  children
}) => {
  const navigate = useNavigate();
  const userDetail = useSelector((state: RootStateType) =>  state.userDetail);
  const isAuthenticated = userDetail.token !== null;

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
    console.log("rock----", userDetail);
    console.log("aaaa--------------", userDetail.role?.Admin);
    if(userDetail.role?.Admin===true){
      navigate("/admin")
    }
    if(userDetail.role?.Admin===false && location.pathname === "/admin"){
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
  const ServerUrl = "http://localhost:8000"
  // const ServerUrl = "https://codegalaxy-server.onrender.com"
 const dispatch = useDispatch()
 const userDetail = useSelector((state: RootStateType) =>  state.userDetail);
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
    const result = await fetch(`${ServerUrl}/api/user/update/`, {
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
    if(jsondata.success){
      console.log("go--------------------------",jsondata);
      
    dispatch(setUserDetail(jsondata.result))
    toast("Updated")
    }
  };
  const handleCodeExecution = async(data:any)=>{
    const result = await fetch(`${ServerUrl}/api/problemset/executeproblem`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...data
      }),
    });
    const jsondata  = await result.json();
    return jsondata
  }

  return (
    <>
      <MainContext.Provider
        value={{
          handleCodeExecution,
          ServerUrl,
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
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="*" element={<Error />} />
            <Route path="/demo2" element={<Demo2 />} />
            <Route path="/playground" element={
              <ProtectedRoute>
              <PlayGround />
               </ProtectedRoute>
              } />
            

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
