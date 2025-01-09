// import { useNavigate } from 'react-router-dom'
import {   } from "react";
import {  } from "react-router";
import MainContext from "../context/main";
import { useNavigate } from "react-router";
import { useContext, useEffect } from "react";
function Home() {
  const navigate = useNavigate()
  const context = useContext(MainContext);
  const {EntireUserDetail,fetchUserDetailFromLocalStorage} = context;
  useEffect(() => {
    if(EntireUserDetail.token === null){
      const success = fetchUserDetailFromLocalStorage("fetchFromLocal",{})
      if(!success){
        navigate("/login")
      }
}})
  // const navigate = useNavigate()
  // const [Logged,setLogged] = useState(false);
  // useEffect(() => {
  //   if(!Logged){
  //     navigate("/signup")
  //   }

  // }, [])
  const initialData = {
    id: null,
    name:null,
    age: null,
    gender: null,
    userName: null,
    email: null,
    collegeName: null,
    contestDetails: null,
    country: null,
    googleLoginAccess: false,
    noOfContestParticipated: null,
    noOfProblemSolved: null,
    role: null,
    solvedProblemDetails: null,
    state: null,
    totalRank: null,
    token:null
  };

  useEffect(() => {
    try {
      if(JSON.parse(localStorage.getItem("User") || 'null')===null)
        localStorage.setItem("User", JSON.stringify(initialData));      
      const user = JSON.parse(localStorage.getItem("User") || '{}');
      console.log("---",user,"---------------",typeof user);
      user.token!==null?console.log("token-",user.token):navigate("/login");
      
      
    } catch (error) {
      console.log(error);
    }
  }, []);

  return <div>Home</div>;
}

export default Home;
