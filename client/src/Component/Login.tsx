
import { Link, useNavigate } from "react-router-dom";
// import { useNavigate } from 'react-router-dom'
import logo from "../assets/logo.png";
import spinner from "../assets/tube-spinner.svg";
import { useForm, SubmitHandler } from "react-hook-form";
import {apiFetch} from "../utils/api";

import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useDispatch } from "react-redux";
import { setUserDetail } from "../store/slice/UserDetailSlice";
import { useContext, useEffect, useState } from "react";
import MainContext from "../context/main";
import { toast } from "react-toastify";
import {SignedOut, SignInButton, useUser } from "@clerk/clerk-react";
import { signInWithGoogle } from "./firebase";
import { Button } from "react-bootstrap";

// Define the form schema using Yup
const schema = yup.object({
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required(),
  email: yup.string().email("Invalid email address").required(),
});

interface LoginFormValues {
  password: string;
  email: string;
}

function Login() {

  // Handle Google Sign-in
  const handleGoogleLogin = async () => {
    const user = await signInWithGoogle();
    console.log("user-", user?.email);

    if (user) {
      let result = await apiFetch(`/api/user/thirdpartylogin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: user.email }),
      });
      let jsondata = await result;
      console.log("res---", jsondata);
      console.log(jsondata.result);
      if (jsondata.success) {
        dispatch(setUserDetail(jsondata.result));
        sessionStorage.setItem("token", jsondata.result.token);

        navigate("/");
        toast.success("Logged in");
      }
    }
  };
  // const userDetail = useSelector((state:RootStateType)=>state.userDetail)
  const context = useContext(MainContext);
  const { SERVER_URL } = context;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: yupResolver(schema),
  });
  const [spinnerStatus, setspinnerStatus] = useState(false);
  useEffect(() => {
    console.log(spinnerStatus);
  }, [spinnerStatus]);

  const onSubmit: SubmitHandler<LoginFormValues> = (data) => {
    console.log(data);
    handleLoginAccount(data);
  };
  const handleLoginAccount = async (data: LoginFormValues) => {
    setspinnerStatus(true);
    try {
      const result = await apiFetch(`/api/user/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: data.email, password: data.password }),
      });
      const jsondata = await result;
      console.log(jsondata);
      if (jsondata.success) {
        dispatch(setUserDetail(jsondata.result));
        sessionStorage.setItem("token", jsondata.result.token);

        navigate("/");
        toast.success("Hello " + jsondata.result.name);
      } else {
        toast.error("Failed to Login");
      }
    } catch (error) {
      console.log(error);
      toast.error("Internal Server Error");
    }
    setspinnerStatus(false);
  };


  
    const { isSignedIn, user } = useUser();
  
    useEffect(() => {
      const handleThirdPartyLogin = async () => {
        if (!isSignedIn || !user) return;
        try {
          const response = await apiFetch(`/api/user/thirdpartylogin`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: user.primaryEmailAddress?.emailAddress,
            }),
          });
  
          const jsonData = await response;
  
          if (jsonData.success) {
            dispatch(setUserDetail(jsonData.result));
            sessionStorage.setItem("token", jsonData.result.token);
            navigate("/");
            toast.success("Signed Up");
          }
        } catch (error) {
          console.error("Login failed:", error);
          toast.error("Failed to sign in");
        }
      };
  
      handleThirdPartyLogin();
    }, [isSignedIn, user, SERVER_URL, dispatch, navigate]);
  
  
  return (
    <>
      <div className="main">
        <div className="login-container">
          <form onSubmit={handleSubmit(onSubmit)} className="login-form">
            <p className="logo">
              <img src={logo} height={"50px"} width={"50px"} />
            </p>
            <h1 className="logo">
              <span style={{ color: "rgb(0 109 255)" }}>Code</span>
              <span style={{ color: "#FCB040" }}>Galaxy</span>
            </h1>
            <div className="form-group">
              <input
                type="email"
                placeholder="E-mail address"
                {...register("email")}
                className={errors.email ? "error" : ""}
              />
              <p className="error-message">{errors.email?.message}</p>
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
            <div style={{display:"flex",flexDirection:"row",justifyContent:"right"}}>
              <p style={{color:"blue",fontSize:"0.7rem",cursor:"pointer"}} onClick={()=>{navigate("/forget-password")}}>Forget Password ?</p>
            </div>

            <button
              type="submit"
              disabled={spinnerStatus}
              className="btn-submit"
            >
              Login{" "}
              <img
                className={`d-${spinnerStatus ? "inline" : "none"}`}
                src={spinner}
                height={"22px"}
                width={"22px"}
              />
            </button>
            <p className="login-link text-dark">
              Create a account? <Link to="/signup">Sign Up</Link>
            </p>
            <div>
            <Button
  onClick={handleGoogleLogin}
  style={{
    marginTop: "0.3rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
    backgroundColor: "white",
    border: "1px solid #ddd",
    borderRadius: "5px",
    padding: "10px 10px",
    fontSize: "13px",
    cursor: "pointer",
    width: "100%",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    color:"black"
  }}
>
  {/* Google Logo */}
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 48 48"
    width="20"
    height="20"
  >
    <path
      fill="#4285F4"
      d="M24 9.5c3.67 0 6.31 1.45 8.2 2.67l6.1-6.1C34.78 3.46 29.93 1.5 24 1.5 14.92 1.5 7.26 7.08 4 14.5l7.1 5.5C12.61 14.4 17.83 9.5 24 9.5z"
    />
    <path
      fill="#34A853"
      d="M46.1 24.5c0-1.35-.12-2.64-.35-3.89H24v7.89h12.7c-.58 2.89-2.32 5.32-4.83 6.99l7.1 5.5c4.17-3.84 6.3-9.51 6.3-16.49z"
    />
    <path
      fill="#FBBC05"
      d="M10.9 28.5c-1.26-3.77-1.26-7.99 0-11.76l-7.1-5.5c-3.09 6.14-3.09 13.12 0 19.26l7.1-5.5z"
    />
    <path
      fill="#EA4335"
      d="M24 46.5c5.93 0 10.78-1.96 14.3-5.5l-7.1-5.5c-2 1.37-4.56 2.18-7.2 2.18-6.17 0-11.39-4.9-12.9-11.5l-7.1 5.5c3.26 7.42 10.92 12.99 19 12.99z"
    />
  </svg>

  {/* Sign-in Text */}
  <span
    style={{
      flexGrow: 1,
      textAlign: "center",
      fontSize: "0.9rem",
    }}
  >
    Sign in with Google
  </span>
</Button>

              <SignedOut>
                <SignInButton mode="modal">
                  <button
                    style={{
                      marginTop:"0.3rem",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "10px",
                      backgroundColor: "white",
                      border: "1px solid #ddd",
                      borderRadius: "5px",
                      padding: "10px 20px",
                      fontSize: "13px",
                      cursor: "pointer",
                      width: "100%",
                      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                      }}
                    >
                      <svg
                        role="img"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        width="20"
                        height="20"
                        style={{ left: "-5.6rem",position:"relative" }}
                      >
                        <title>GitHub</title>
                        <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.302 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.757-1.333-1.757-1.09-.745.083-.729.083-.729 1.205.084 1.84 1.238 1.84 1.238 1.07 1.835 2.805 1.305 3.49.998.108-.775.418-1.305.76-1.605-2.665-.304-5.467-1.333-5.467-5.93 0-1.31.465-2.38 1.235-3.22-.135-.304-.54-1.524.105-3.175 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.4 3-.405 1.02.005 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.65.24 2.87.12 3.175.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.605-.015 2.9-.015 3.3 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                      </svg>
                      <span style={{ flexGrow: 1, textAlign: "center" ,fontSize: "0.9rem",position: "relative",right: "0.2rem"}}>
                      Sign in with GitHub
                      </span>
                    </div>
                  </button>
                </SignInButton>
              </SignedOut>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default Login;
