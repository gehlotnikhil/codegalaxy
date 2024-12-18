import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const CLIENT_ID = "Ov23li1Ee2cnNpYQGRb5";
  const [userdata, setUserdata] = useState({login:""});
  const [hasAccessToken, setHasAccessToken] = useState(
    !!localStorage.getItem("accesstoken")
  );

  function loginWithGithub() {
    window.location.assign(
      `https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}`
    );
  }

  useEffect(() => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const codeParam = urlParams.get("code");

    if (codeParam && !localStorage.getItem("accesstoken")) {
      async function getAccessToken() {
        try {
          const response = await fetch(
            `http://localhost:8000/api/user/getaccesstoken?code=${codeParam}`,
            {
              method: "GET",
            }
          );
          const data = await response.json();
          if (data.access_token) {
            localStorage.setItem("accesstoken", data.access_token);
            setHasAccessToken(true);
          } else {
            console.error("Failed to fetch access token:", data);
          }
        } catch (error) {
          console.error("Error fetching access token:", error);
        }
      }
      getAccessToken();
    }
  }, []);

  async function getUserData() {
    try {
      const response = await fetch("http://localhost:8000/api/user/getuserdata", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accesstoken")}`,
        },
      });
      const data = await response.json();
      setUserdata(data);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  }

  function logout() {
    localStorage.removeItem("accesstoken");
    setUserdata({login:""});
    setHasAccessToken(false);
  }

  return (
    <div className="App">
      {hasAccessToken ? (
        <>
          <h1>Welcome!</h1>
          <button onClick={logout}>Log out</button>
          <h3>Get user data from GitHub</h3>
          <button onClick={getUserData}>Fetch User Data</button>
          {userdata ? (
            <div>
              <h4>Hello, {userdata.login}!</h4>
            </div>
          ) : (
            <p>No user data available. Click "Fetch User Data" to load.</p>
          )}
        </>
      ) : (
        <>
          <h3>User not logged in</h3>
          <button type="button" onClick={loginWithGithub}>
            Login with GitHub
          </button>
        </>
      )}
    </div>
  );
}

export default App;
