// import React, { useState } from "react";
// import { initializeApp } from "firebase/app";
// import { getAuth, createUserWithEmailAndPassword, sendEmailVerification, signInWithEmailAndPassword } from "firebase/auth";

// // Firebase Configuration
// const firebaseConfig = {
//   apiKey: "AIzaSyCB5Iep-Lyw-F6vIX_1rkyxEWs7n9Uauqg",
//   authDomain: "codegalaxy100.firebaseapp.com",
//   projectId: "codegalaxy100",
//   storageBucket: "codegalaxy100.firebasestorage.app",
//   messagingSenderId: "950714739032",
//   appId: "1:950714739032:web:b63fe46ba186fc901e9d2d",
//   measurementId: "G-VY18QER6NY"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const auth = getAuth(app);

// const Testing1: React.FC = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [message, setMessage] = useState("");
//   const [isVerified, setIsVerified] = useState(false);

//   // Register and Send Verification Email
//   const handleRegister = async () => {
//     try {
//       const userCredential = await createUserWithEmailAndPassword(auth, email, password);
//       const user = userCredential.user;
      
//       await sendEmailVerification(user);
//       setMessage("Verification email sent! Please check your inbox.");
//     } catch (error: any) {
//       setMessage(error.message);
//     }
//   };

//   // Check Email Verification Status
//   const checkVerification = async () => {
//     const user = auth.currentUser;
//     if (user) {
//       await user.reload();
//       if (user.emailVerified) {
//         setIsVerified(true);
//         setMessage("✅ Email Verified! You can now log in.");
//       } else {
//         setMessage("❌ Email not verified. Please check your inbox.");
//       }
//     }
//   };

//   // Login after verification
//   const handleLogin = async () => {
//     try {
//       const userCredential = await signInWithEmailAndPassword(auth, email, password);
//       if (userCredential.user.emailVerified) {
//         setMessage("🎉 Login Successful!");
//       } else {
//         setMessage("⚠️ Please verify your email before logging in.");
//       }
//     } catch (error: any) {
//       setMessage(error.message);
//     }
//   };

//   return (
//     <div style={{ textAlign: "center", maxWidth: "400px", margin: "auto", padding: "20px", border: "1px solid #ccc", borderRadius: "10px" }}>
//       <h2>Register with Email</h2>
//       <input 
//         type="email" 
//         placeholder="Email" 
//         value={email} 
//         onChange={(e) => setEmail(e.target.value)} 
//         style={{ display: "block", margin: "10px auto", padding: "8px" }}
//       />
//       <input 
//         type="password" 
//         placeholder="Password" 
//         value={password} 
//         onChange={(e) => setPassword(e.target.value)} 
//         style={{ display: "block", margin: "10px auto", padding: "8px" }}
//       />
//       <button onClick={()=>handleRegister()} style={{ margin: "10px", padding: "10px", cursor: "pointer" }}>Register</button>
//       <button onClick={()=>checkVerification()} style={{ margin: "10px", padding: "10px", cursor: "pointer" }}>Check Verification</button>
//       <button onClick={()=>handleLogin()} style={{ margin: "10px", padding: "10px", cursor: "pointer" }}>Login</button>
//       <p>{message}</p>
//       {isVerified && <p style={{ color: "green" }}>✅ Verified! You can now login.</p>}
//     </div>
//   );
// };

// export default Testing1;

import React, { useState } from "react";
import { initializeApp } from "firebase/app";
import { getAuth, sendSignInLinkToEmail, signInWithEmailLink, isSignInWithEmailLink } from "firebase/auth";

// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyCB5Iep-Lyw-F6vIX_1rkyxEWs7n9Uauqg",
  authDomain: "codegalaxy100.firebaseapp.com",
  projectId: "codegalaxy100",
  storageBucket: "codegalaxy100.firebasestorage.app",
  messagingSenderId: "950714739032",
  appId: "1:950714739032:web:b63fe46ba186fc901e9d2d",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const Testing1: React.FC = () => {
  const [email, setEmail] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [message, setMessage] = useState("");

  // Send OTP (Magic Link)
  const sendOTP = async () => {
    const actionCodeSettings = {
      url: window.location.href, // Redirect to the same page after OTP verification
      handleCodeInApp: true,
    };

    try {
      await sendSignInLinkToEmail(auth, email, actionCodeSettings);
      localStorage.setItem("emailForSignIn", email);
      setOtpSent(true);
      setMessage(`✅ OTP sent to ${email}. Check your inbox.`);
    } catch (error: any) {
      setMessage(`❌ Error: ${error.message}`);
    }
  };

  // Verify OTP (Magic Link)
  const verifyOTP = async () => {
    if (isSignInWithEmailLink(auth, window.location.href)) {
      try {
        const emailStored = localStorage.getItem("emailForSignIn");
        if (!emailStored) throw new Error("No email found. Try again.");

        await signInWithEmailLink(auth, emailStored, window.location.href);
        setMessage(`🎉 Email Verified! You are logged in.`);
        localStorage.removeItem("emailForSignIn");
      } catch (error: any) {
        setMessage(`❌ Error: ${error.message}`);
      }
    } else {
      setMessage("⚠️ No valid OTP link found. Try again.");
    }
  };

  return (
    <div style={{ textAlign: "center", padding: "20px", maxWidth: "400px", margin: "auto", border: "1px solid #ccc", borderRadius: "10px" }}>
      <h2>Email OTP Verification</h2>
      {!otpSent ? (
        <>
          <input
            type="email"
            placeholder="Enter Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ display: "block", margin: "10px auto", padding: "8px" }}
          />
          <button onClick={sendOTP} style={{ margin: "10px", padding: "10px", cursor: "pointer" }}>Send OTP</button>
        </>
      ) : (
        <button onClick={verifyOTP} style={{ margin: "10px", padding: "10px", cursor: "pointer" }}>Verify OTP</button>
      )}
      <p>{message}</p>
    </div>
  );
};

export default Testing1;
