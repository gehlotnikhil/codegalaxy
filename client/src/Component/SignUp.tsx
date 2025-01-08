// src/SignUp.tsx
import React, { useEffect, useState } from "react";
// import { useNavigate } from 'react-router-dom'
import { Link } from "react-router-dom";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
// Define the form schema using Yup
const schema = yup.object({
  username: yup.string().required("Username is required"),
  password: yup.string().min(6, "Password must be at least 6 characters").required(),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match")
    .required("Confirm Password is required"),
  email: yup.string().email("Invalid email address").required(),
});

interface SignUpFormValues {
  username: string;
  password: string;
  confirmPassword: string;
  email: string;
}
interface JWTDECODETYPE {
  email: string;
}

const SignUp: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormValues>({
    resolver: yupResolver(schema),
  });

  const onSubmit: SubmitHandler<SignUpFormValues> = (data) => {
    console.log(data);
    handleCreateAccount(data)
  };
  
  
  const handleCreateAccount = async(data:SignUpFormValues)=>{
    let result = await fetch(
      "http://localhost:8000/api/user/registeruser",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body:JSON.stringify({"userName":data.username,"email":data.email,"password":data.password})
      }
    );
    const jsondata = await result.json();
    console.log("Account Created - ",jsondata);
    console.log(jsondata.user);
    const savedata = {...(JSON.parse(localStorage.getItem("User")||'{}')),
    id: jsondata.user.id,
    userName: jsondata.user.id,
    email: jsondata.user.email,
    contestDetails: [],
    googleLoginAccess: jsondata.user.googleLoginAccess,
    noOfContestParticipated: 0,
    noOfProblemSolved: 0,
    role: jsondata.user.role,
    solvedProblemDetails: [],
    totalRank: 1000,
    token:jsondata.token
    }
    localStorage.setItem("User",JSON.stringify(savedata))
    
  }

  return (
    <div className="main">
    <div className="signup-container ">
      <form onSubmit={handleSubmit(onSubmit)} className="signup-form ">
        <p className="logo">
        <img  src="./logo.png" height={"50px"} width={"50px"}  />
        </p>
        <h1 className="logo"><span style={{color:"rgb(0 109 255)"}}>Code</span><span style={{color:"#FCB040"}}>Galaxy</span></h1>
        <div className="form-group">
          <input
            type="text"
            placeholder="Username"
            {...register("username")}
            className={`{errors.username ? "error" : ""}`}
          />
          <p className="error-message">{errors.username?.message}</p>
        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="Password"
            {...register("password")}
            className={errors.password ? "error" : ""}
          />
          <p className="error-message">{errors.password?.message}</p>
        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="Confirm password"
            {...register("confirmPassword")}
            className={errors.confirmPassword ? "error" : ""}
          />
          <p className="error-message">{errors.confirmPassword?.message}</p>
        </div>
        <div className="form-group">
          <input
            type="email"
            placeholder="E-mail address"
            {...register("email")}
            className={errors.email ? "error" : ""}
          />
          <p className="error-message">{errors.email?.message}</p>
        </div>
        <button type="submit"  className="btn-submit">
          Sign Up
        </button>
        <p className="signin-link text-dark">
          Have an account? <Link to="/login">Sign In</Link>
        </p>
        <div>
        <GoogleOAuthProvider clientId="1046247015186-25rspsek03t24m78r9qme04grrq433ue.apps.googleusercontent.com">
        <GoogleLogin
          onSuccess={async (credentialResponse) => {
            var decode = jwtDecode<JWTDECODETYPE>(
              credentialResponse.credential as string
            );
            console.log(decode.email);
            let result = await fetch(
              "http://localhost:8000/api/user/googlelogin",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ email: decode.email }),
              }
            );
            let res = await result.json();
            console.log("res---", res);
          }}
          onError={() => {
            console.log("Login Failed");
          }} 
        />
      </GoogleOAuthProvider>
        </div>
      </form>
    </div>
    </div>
  );
};

export default SignUp;
