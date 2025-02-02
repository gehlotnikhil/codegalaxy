import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { Link, useNavigate } from "react-router-dom";
// import { useNavigate } from 'react-router-dom'
import logo from '../assets/logo.png';  
import spinner from '../assets/tube-spinner.svg';
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useDispatch } from "react-redux";
import { setUserDetail } from "../store/slice/UserDetailSlice";
import { useContext, useEffect, useState } from "react";
import MainContext from "../context/main";
import { toast } from "react-toastify";

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
  // const userDetail = useSelector((state:RootStateType)=>state.userDetail)
  const context = useContext(MainContext)
  const {SERVER_URL} = context
  const dispatch = useDispatch()
  const navigate = useNavigate();
  interface JWTDECODETYPE {
    email: string;
  }
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: yupResolver(schema),
  });
const [spinnerStatus, setspinnerStatus] = useState(false)
useEffect(() => {
  console.log(spinnerStatus);
  
}, [spinnerStatus])

  const onSubmit: SubmitHandler<LoginFormValues> = (data) => {
    console.log(data);
    handleLoginAccount(data);
  };
  const handleLoginAccount = async (data: LoginFormValues) => {
    setspinnerStatus(true)
    try {
      const result = await fetch(`${SERVER_URL}/api/user/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: data.email, password: data.password }),
      });
      const jsondata = await result.json();
      console.log(jsondata);
      if(jsondata.success){
        dispatch(setUserDetail(jsondata.result))
      localStorage.setItem("token",jsondata.result.token)
      
      
      navigate("/");
      toast.success("Hello "+jsondata.result.name)
      }else{
        toast.error("Failed to Login")
  
      }
    } catch (error) {
      console.log(error);
      toast.error("Internal Server Error")
    }
    setspinnerStatus(false)
   
  };

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

            <button type="submit"  disabled={spinnerStatus} className="btn-submit">
              Login <img className={`d-${spinnerStatus?"inline":"none"}`} src={spinner} height={"22px"} width={"22px"}/>
            </button>
            <p className="login-link text-dark">
              Create a account? <Link to="/signup">Sign Up</Link>
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
                    if(jsondata.success){
                      dispatch(setUserDetail(jsondata.result))
                      localStorage.setItem("token",jsondata.result.token)

                      navigate("/");
                      toast.success("Logged in")

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
    </>
  );
}

export default Login;
