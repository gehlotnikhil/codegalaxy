import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom"; // Ensure this is `react-router-dom`
import Login from "./Component/Login";
import AppNavbar from "./Component/Navbar";
import SignUp from "./Component/SignUp";
import Home from "./Component/Home";
import About from "./Component/About";
import Profile from "./Component/Profile";
import Error from "./Component/Error";
import Admin from "./Component/Admin";
import MainContext from "./context/main";
import { useState } from "react";
function App() {
  const ChangeCodeEditorDesign = () => {};
  const [Demo, setDemo] = useState("hello world");
  return (
    <>
      {/* <MainContext.Provider value={{ }}> */}
      <MainContext.Provider value={{ Demo, setDemo, ChangeCodeEditorDesign }}>
        <BrowserRouter>
          <AppNavbar />
          <Routes>
            <Route index element={<Home />} />
            {/* <Route path="/" element={<Home />} /> */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/about" element={<About />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="*" element={<Error />} />
          </Routes>
        </BrowserRouter>
      </MainContext.Provider>
    </>
  );
}

export default App;
