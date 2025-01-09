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
import { useState ,useEffect} from "react";
import Profile from "./Component/Profile";
import EditProfile from "./Component/EditProfile";
import UploadPage from "./Component/UploadPage";
import DisplayPage from "./Component/DisplayPage";
import Testing1 from "./Component/testing1";
function App() {
  const defaultProfilePicture = "https://res.cloudinary.com/diqpelkm9/image/upload/f_auto,q_auto/k4s9mgdywuaasjuthfxk"
  const [initialProfilePicture, setinitialProfilePicture] = useState(defaultProfilePicture)
  useEffect(() => {
    console.log("Changed picture-",initialProfilePicture);
  }, [initialProfilePicture])
  
  const [profilePicture, setProfilePicture] = useState<File>(new File([""], "filename"));


  const ChangeCodeEditorDesign = () => {};
  const [Demo, setDemo] = useState("hello world");
  const [CodeOfEditor, setCodeOfEditor] = useState(``);
    const handleEditorChange = (value: string | undefined) => {
      setCodeOfEditor(value || "");
    };
    useEffect(() => {
      console.log(CodeOfEditor);
      
    }, [CodeOfEditor])

  return (
    <>
      {/* <MainContext.Provider value={{ }}> */}
      <MainContext.Provider value={{initialProfilePicture, setinitialProfilePicture,handleEditorChange,setCodeOfEditor,CodeOfEditor, Demo, setDemo, ChangeCodeEditorDesign, profilePicture, setProfilePicture,defaultProfilePicture }}>
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
