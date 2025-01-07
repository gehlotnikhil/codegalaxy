import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { Link } from "react-router-dom";
// import { useNavigate } from 'react-router-dom'

import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
// Define the form schema using Yup
const schema = yup.object({
  password: yup.string().min(6, "Password must be at least 6 characters").required(),
  email: yup.string().email("Invalid email address").required(),
});

interface LoginFormValues {
  password: string;
  email: string;
}

function Login() {
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
    alert("Sign Up Successful!");
  };

  return (
    <>
    <div className="main">
      <div className="login-container">
        <form onSubmit={handleSubmit(onSubmit)} className="login-form">
          <p className="logo">
            <img src="./logo.png" height={"50px"} width={"50px"} />
          </p>
          <h1 className="logo"><span style={{ color: "rgb(0 109 255)" }}>Code</span><span style={{ color: "#FCB040" }}>Galaxy</span></h1>
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
          <p className="login-link">
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
    </>
  );
}

export default Login;
