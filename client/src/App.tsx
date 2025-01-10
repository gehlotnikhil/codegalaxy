import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom"; // Ensure this is `react-router-dom`
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
function App() {



  
  interface EntireUserDetailType {
    id: string | null;
    name: string | null;
    age: number | null;
    gender: string | null;
    userName: string | null;
    email: string | null;
    collegeName: string | null;
    contestDetails: any | null;
    country: string | null;
    googleLoginAccess: string | null;
    noOfContestParticipated: number | null;
    noOfProblemSolved: number | null;
    role: any | null;
    solvedProblemDetails: any | null;
    state: string | null;
    totalRank: number | null;
    token: string | null;
    profilePictureUrl: string | null;
    password: string | null;
  }
  const [EntireUserDetail, setEntireUserDetail] =
    useState<EntireUserDetailType>({
      id: null,
      name: null,
      age: null,
      gender: null,
      userName: null,
      email: null,
      collegeName: null,
      contestDetails: null,
      country: null,
      googleLoginAccess: null,
      noOfContestParticipated: null,
      noOfProblemSolved: null,
      role: null,
      solvedProblemDetails: null,
      state: null,
      totalRank: null,
      token: null,
      profilePictureUrl: null,
      password: null,
    });
const setUserDetailToLocalStorage = (query: string,
  data: any
): boolean => {
  query;
    data;
    console.log("setUserDetailToLocalStorage-", user);
    if (data !== null) {
      const savedata:EntireUserDetailType = ({
        id: data.id,
        name: data.name,
        age: data.age,
        gender: data.gender,
        userName: data.userName,
        email: data.email,
        collegeName: data.collegeName,
        contestDetails: data.contestDetails,
        country: data.country,
        googleLoginAccess: data.googleLoginAccess,
        noOfContestParticipated: data.noOfContestParticipated,
        noOfProblemSolved: data.noOfProblemSolved,
        role: data.role,
        solvedProblemDetails: data.solvedProblemDetails,
        state: data.state,
        totalRank: data.totalRank,
        token: data.token,
        profilePictureUrl: data.profilePictureUrl,
        password: data.password
      });
      localStorage.setItem("User",JSON.stringify(savedata))

      return true;
    }
    return false;

}

  const fetchUserDetailFromLocalStorage = (
    query: string,
    data: any
  ): boolean => {
    query;
    data;
    const user = JSON.parse(localStorage.getItem("User") || "null");
    console.log("fetchUserDetailFromLocalStorage-", user);
    if (user !== null) {
      setEntireUserDetail({
        id: user.id,
        name: user.name,
        age: user.age,
        gender: user.gender,
        userName: user.userName,
        email: user.email,
        collegeName: user.collegeName,
        contestDetails: [],
        country: user.country,
        googleLoginAccess: user.googleLoginAccess,
        noOfContestParticipated: 0,
        noOfProblemSolved: 0,
        role: user.role,
        solvedProblemDetails: [],
        state: user.state,
        totalRank: 1000,
        token: user.token,
        profilePictureUrl: user.profilePictureUrl,
        password: user.password,
      });
      return true;
    }
    return false;
  };

  useEffect(() => {
    console.log("EntireUserDetail-", EntireUserDetail);
  }, [EntireUserDetail]);

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
        token: user.token,
        ...data,
      }),
    });
    const jsondata = await result.json();
  };

  return (
    <>
      {/* <MainContext.Provider value={{ }}> */}
      <MainContext.Provider
        value={{
          setUserDetailToLocalStorage,
          fetchUserDetailFromLocalStorage,
          EntireUserDetail,
          setEntireUserDetail,
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
            <Route index element={<Home />} />
            {/* <Route path="/" element={<Home />} /> */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="*" element={<Error />} />
            <Route path="/admin" element={<Admin />} />

            <Route path="/about" element={<About />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/test" element={<EditProfile />} />
            <Route path="/test2" element={<Testing1 />} />
            <Route path="/upload" element={<UploadPage />} />
            <Route path="/display" element={<DisplayPage />} />
          </Routes>
        </BrowserRouter>
      </MainContext.Provider>
    </>
  );
}

export default App;
