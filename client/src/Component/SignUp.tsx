import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import spinner from "../assets/tube-spinner.svg";

import logo from "../assets/logo.png";

import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { useDispatch } from "react-redux";
import { setUserDetail } from "../store/slice/UserDetailSlice";
import MainContext from "../context/main";
import { toast } from "react-toastify";

// Define the form schema using Yup
const schema = yup.object({
  name: yup.string().required("name is required"),
  age: yup.number().required("age is required"),
  collegeName: yup.string().required("collegeName is required"),
  username: yup.string().required("Username is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required(),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match")
    .required("Confirm Password is required"),
  email: yup.string().email("Invalid email address").required(),
});

interface SignUpFormValues {
  name: string;
  age: number;
  collegeName: string;
  username: string;
  password: string;
  confirmPassword: string;
  email: string;
}
interface JWTDECODETYPE {
  email: string;
}

const SignUp: React.FC = () => {
  const [spinnerStatus, setspinnerStatus] = useState<boolean>(false);
  useEffect(() => {
    console.log(spinnerStatus);
  }, [spinnerStatus]);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const context = useContext(MainContext);
  const { SERVER_URL } = context;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormValues>({
    resolver: yupResolver(schema),
  });

  const onSubmit: SubmitHandler<SignUpFormValues> = (data) => {
    console.log("submiting--", data);
    handleCreateAccount(data);
  };

  const handleCreateAccount = async (data: SignUpFormValues) => {
    setspinnerStatus(true);
    try {
      let result = await fetch(`${SERVER_URL}/api/user/registeruser`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name:data.name,
          age:Number(data.age),
          collegeName:data.collegeName,
          userName: data.username,
          email: data.email,
          password: data.password,
        }),
      });
      const jsondata = await result.json();
      console.log("-a-a - ", jsondata);
      console.log(jsondata.result);
      if (jsondata.success) {
        localStorage.setItem("verifyemail", jsondata.result.email);
        navigate("/verify");
        toast.success(jsondata.msg);
      } else {
        toast.error(jsondata.msg);
      }
    } catch (error) {
      toast.error("Internal Server Error");
      console.log(error);
    }
    setspinnerStatus(false);
  };
  // const handleCreateAccount = async(data:SignUpFormValues)=>{
  //   setspinnerStatus(true)
  //   try {
  //     let result = await fetch(
  //       `${SERVER_URL}/api/user/registeruser`,
  //       {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body:JSON.stringify({"userName":data.username,"email":data.email,"password":data.password})
  //       }
  //     );
  //     const jsondata = await result.json();
  //     console.log("Account Created - ",jsondata);
  //     console.log(jsondata.result);
  //     if(jsondata.success){
  //        dispatch(setUserDetail(jsondata.result))
  //        navigate("/");
  //        toast.success("Account Created")
  //        }else{
  //         toast.error("Failed to Create Account")
  //        }
  //   } catch (error) {
  //     toast.error("Internal Server Error")
  //     console.log(error);
  //   }
  //   setspinnerStatus(false)
  // }

  return (
    <div className="main">
      <div className="signup-container ">
        <form onSubmit={handleSubmit(onSubmit)} className="signup-form ">
          <p className="logo">
            <img src={logo} height={"50px"} width={"50px"} />
          </p>
          <h1 className="logo">
            <span style={{ color: "rgb(0 109 255)" }}>Code</span>
            <span style={{ color: "#FCB040" }}>Galaxy</span>
          </h1>
          <div className="form-group">
            <input
              type="text"
              placeholder="Name"
              {...register("name")}
              className={`{errors.name ? "error" : ""}`}
            />
            <p className="error-message">{errors.name?.message}</p>
          </div>
          <div className="form-group">
            <input
              type="number"
              placeholder="Age"
              {...register("age")}
              className={`{errors.age ? "error" : ""}`}
            />
            <p className="error-message">{errors.age?.message}</p>
          </div>
          <div className="form-group">
            <input
              type="text"
              placeholder="College Name"
              {...register("collegeName")}
              className={`{errors.username ? "error" : ""}`}
            />
            <p className="error-message">{errors.collegeName?.message}</p>
          </div>
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
          <button type="submit" disabled={spinnerStatus} className="btn-submit">
            Sign Up{" "}
            <img
              className={`d-${spinnerStatus ? "inline" : "none"}`}
              src={spinner}
              height={"22px"}
              width={"22px"}
            />
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
                    `${SERVER_URL}/api/user/googlelogin`,
                    {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({ email: decode.email }),
                    }
                  );
                  let jsondata = await result.json();
                  console.log("res---", jsondata);
                  console.log(jsondata.result);
                  if (jsondata.success) {
                    dispatch(setUserDetail(jsondata.result));
                    localStorage.setItem("token", jsondata.result.token);

                    navigate("/");
                    toast.success("Signed Up");
                  }
                }}
                onError={() => {
                  console.log("Login Failed");
                  toast.error("Login Failed");
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
