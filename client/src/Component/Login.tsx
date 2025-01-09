import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { Link, useNavigate } from "react-router-dom";
// import { useNavigate } from 'react-router-dom'

import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
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

  const onSubmit: SubmitHandler<LoginFormValues> = (data) => {
    console.log(data);
    handleLoginAccount(data);
  };
  const handleLoginAccount = async (data: LoginFormValues) => {
    const result = await fetch("http://localhost:8000/api/user/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: data.email, password: data.password }),
    });
    const jsondata = await result.json();
    console.log(jsondata);

    const savedata = {
      id: jsondata.user.id,
      name: jsondata.user.name,
      age: jsondata.user.age,
      gender: jsondata.user.gender,
      userName: jsondata.user.id,
      email: jsondata.user.email,
      collegeName: jsondata.user.collegeName,
      contestDetails: [],
      country: jsondata.user.country,
      googleLoginAccess: jsondata.user.googleLoginAccess,
      noOfContestParticipated: 0,
      noOfProblemSolved: 0,
      role: jsondata.user.role,
      solvedProblemDetails: [],
      state: jsondata.user.state,
      totalRank: 1000,
      token: jsondata.token,
      profilePictureUrl:jsondata.user.profilePictureUrl,
      password:jsondata.user.password

    };
    localStorage.setItem("User", JSON.stringify(savedata));
    navigate("/");
  };

  return (
    <>
      <div className="main">
        <div className="login-container">
          <form onSubmit={handleSubmit(onSubmit)} className="login-form">
            <p className="logo">
              <img src="./logo.png" height={"50px"} width={"50px"} />
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

            <button type="submit" className="btn-submit">
              Login
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
                      "http://localhost:8000/api/user/googlelogin",
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
                    console.log(jsondata.user);
                    const savedata = {
                      id: jsondata.user.id,
                      name: jsondata.user.name,
                      age: jsondata.user.age,
                      gender: jsondata.user.gender,
                      userName: jsondata.user.id,
                      email: jsondata.user.email,
                      collegeName: jsondata.user.collegeName,
                      contestDetails: [],
                      country: jsondata.user.country,
                      googleLoginAccess: jsondata.user.googleLoginAccess,
                      noOfContestParticipated: 0,
                      noOfProblemSolved: 0,
                      role: jsondata.user.role,
                      solvedProblemDetails: [],
                      state: jsondata.user.state,
                      totalRank: 1000,
                      token: jsondata.token,
                    };
                    localStorage.setItem("User", JSON.stringify(savedata));
                    navigate("/");
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
    </>
  );
}

export default Login;
