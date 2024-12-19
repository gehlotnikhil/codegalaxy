import { useState, useEffect } from "react";
import "./App.css";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
function App() {
  
  return (
    <>
        Login with Google
        <hr />
        <GoogleOAuthProvider clientId="1046247015186-25rspsek03t24m78r9qme04grrq433ue.apps.googleusercontent.com">
          <GoogleLogin
            onSuccess={async (credentialResponse) => {
              var decode = jwtDecode(credentialResponse.credential as string);
              console.log(decode);
              
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
