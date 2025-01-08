// import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
function Home() {
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
  if(localStorage.getItem("User")===null)
  localStorage.setItem("User", JSON.stringify(initialData));

  const navigate = useNavigate();
  useEffect(() => {
    try {
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
