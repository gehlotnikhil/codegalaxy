import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom"; // Ensure this is `react-router-dom`
import Login from "./Component/Login";
import AppNavbar from "./Component/Navbar";
import SignUp from "./Component/SignUp";
import Home from "./Component/Home";
import About from "./Component/About";
import Profile from "./Component/Profile";
import Error from "./Component/Error";

function App() {
 return (
   
    <>
      <BrowserRouter>
      <AppNavbar />
    
        <Routes>
          <Route index element={<Home />} />
          {/* <Route path="/" element={<Home />} /> */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/about" element={<About />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="*" element={<Error />} />
        </Routes>

      </BrowserRouter>
      </>
  
  );
}

export default App;
