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
function App() {
  const defaultProfilePicture = ""
  const [initialProfilePicture, setinitialProfilePicture] = useState("")
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
      <MainContext.Provider value={{handleEditorChange,setCodeOfEditor,CodeOfEditor, Demo, setDemo, ChangeCodeEditorDesign, profilePicture, setProfilePicture }}>
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
            <Route path="/upload" element={<UploadPage />} />
            <Route path="/display" element={<DisplayPage />} />
       
          </Routes>
        </BrowserRouter>
      </MainContext.Provider>
    </>
  );
}

export default App;
