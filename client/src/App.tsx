import { useState, useEffect } from "react";
import "./App.css";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
function App() {
  interface JWTDECODETYPE{
    email:string
  }
  return (
    <>
        Login with Google
        <hr />
        <GoogleOAuthProvider clientId="1046247015186-25rspsek03t24m78r9qme04grrq433ue.apps.googleusercontent.com">
          <GoogleLogin
            onSuccess={async (credentialResponse) => {
              var decode = jwtDecode<JWTDECODETYPE>(credentialResponse.credential as string);
              console.log(decode.email);
              let result = await fetch("http://localhost:8000/api/user/googlelogin",{
                method:"POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body:JSON.stringify({email:decode.email})
              })
              let res = await result.json()
              console.log("res---",res);
              
            }}
            onError={() => {
              console.log("Login Failed");
            }}
          />
        </GoogleOAuthProvider>
    </>
  );
}

export default App;
