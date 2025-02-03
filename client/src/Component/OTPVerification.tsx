import React, { useContext, useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import img from "../assets/img7.jpg"
import { useNavigate } from "react-router";
import MainContext from "../context/main";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import {setUserDetail} from "../store/slice/UserDetailSlice"
const OTPVerification: React.FC = () => {
  const dispatch = useDispatch()
  const context = useContext(MainContext)
  const {SERVER_URL}= context
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [verifyemail, setVerifyEmail] = useState("")
  const handleChange = (index: number, value: string) => {
    if (/^\d?$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
    }
  };
  useEffect(() => {
    console.log(otp);
  }, [otp])
  
  const navigate = useNavigate()
useEffect(() => {
  
console.log(verifyemail, " ", verifyemail.length,"  ",verifyemail.length<2);
if(verifyemail === " "){
  navigate("/signup")
}

}, [verifyemail])

  useEffect(() => {
    setVerifyEmail(localStorage.getItem("verifyemail") || " ")

 
  }, [])
const [Status, setStatus] = useState(false)
useEffect(() => {
  
if(Status) navigate("/")
}, [Status])

  const handleVerifyOtp = async(e:any)=>{
    try {
      e.preventDefault()
      console.log(otp.join(""));
      const code = Number(otp.join(""))
      const response = await fetch(`${SERVER_URL}/api/user/verify`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code,verifyemail:verifyemail }),
      });

      const jsonData = await response.json();
      console.log("jsondata - - ",jsonData)
      if(jsonData.success){
        dispatch(setUserDetail(jsonData.result)) 
        toast.success("Account Created")
        setStatus(true)
      }else{
          toast.error(jsonData.msg)
      }
     

    } catch (error) {
      console.log(error);
            toast.error("Internal Server Error")

      
    }
  }
  
  


  
  return (
    <div
      className=" d-flex justify-content-center align-items-center vh-100"
      style={{
        backgroundImage: `url(${img})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="card p-4 shadow" style={{ width: "350px" }}>
        <h4 className="text-center mb-3">OTP Verification</h4>
        <p className="text-muted text-center">
          Enter OTP Code sent to {verifyemail.substring(0,3)}*****@gmail.com
        </p>
        <form action="" onSubmit={(e)=>handleVerifyOtp(e)}>
        <div className="d-flex justify-content-between">
          {otp.map((digit, index) => (
            <input
              key={index}
              type="text"
              maxLength={1}
              className="form-control text-center"
              style={{ width: "40px", fontSize: "20px",border:"1px solid black" }}
              value={digit}
              required
              onChange={(e) => handleChange(index, e.target.value)}
            />
          ))}
        </div>
        <p className="text-center text-muted mt-3">
          Didn't receive OTP? <a href="#">Resend Code</a>
        </p>
        <button className="btn btn-primary w-100 mt-3" type="submit">Verify & Proceed</button>
        </form>
      </div>
    </div>
  );
};

export default OTPVerification;
