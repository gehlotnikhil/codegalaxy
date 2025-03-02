// import React, { useContext, useState } from "react";
// import {
//   logout,
//   sendOtp,
//   setupRecaptcha,
//   signInWithGoogle,
//   verifyOtp,
// } from "./firebase";
// import { Alert, Button, Container, Form } from "react-bootstrap";
// import MainContext from "../context/main";
// import { setUserDetail } from "../store/slice/UserDetailSlice";
// import { useDispatch } from "react-redux";
// import {toast} from 'react-toastify'
// import { useNavigate } from "react-router";
const Testing1: React.FC = () => {
//   const [user, setUser] = useState<any>(null);
//   const [phoneNumber, setPhoneNumber] = useState<string>("");
//   const [otp, setOtp] = useState<string>("");
//   const [verificationId, setVerificationId] = useState<string | null>(null);
//   const [message, setMessage] = useState<string>("");
//   const context = useContext(MainContext)
//   const dispatch = useDispatch()
//   const {SERVER_URL} = context
//   const navigate = useNavigate()
  // Handle Google Sign-in
  // const handleGoogleLogin = async () => {
  //   const user = await signInWithGoogle();
  //   console.log("user-", user?.email);

  //   if (user) {
  //     let result = await fetch(`${SERVER_URL}/api/user/thirdpartylogin`, {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({ email: user.email }),
  //     });
  //     let jsondata = await result.json();
  //     console.log("res---", jsondata);
  //     console.log(jsondata.result);
  //     if (jsondata.success) {
  //       dispatch(setUserDetail(jsondata.result));
  //       localStorage.setItem("token", jsondata.result.token);

  //       navigate("/");
  //       toast.success("Logged in");
  //     }
  //   }
  // };

  // Handle Google Logout
  return (
    // <Container className="mt-5">
    //   <h2 className="text-center">Google Login & MFA</h2>

    //   {user ? (
    //     <Alert variant="success">Logged in as: {user.displayName}</Alert>
    //   ) : (
    //     <Button
    //       variant="primary"
    //       onClick={handleGoogleLogin}
    //       className="w-100 mb-3"
    //     >
    //       Sign in with Google
    //     </Button>
    //   )}

   
   
    // </Container>
    <></>
  );
};

export default Testing1;
