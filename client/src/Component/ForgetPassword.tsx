import {  useEffect, useState } from "react";
import img from "../assets/img7.jfif";
import img2 from "../assets/logo.png";
import { toast } from "react-toastify";
import { setUserDetail } from "../store/slice/UserDetailSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { apiFetch } from '../utils/api';

function ForgetPassword() {
  const navigate = useNavigate()
  const dispatch = useDispatch();
  const [showPromptField, setShowPromptField] = useState(1);
  useEffect(() => {
    console.log("showPromptField---", showPromptField);
  }, [showPromptField]);
  const [FieldData, setFieldData] = useState({
    email: "",
    code: "",
    password: "",
  });
  useEffect(() => {
    console.log("FieldData---", FieldData);
  }, [FieldData]);
  const [SubmitActive, setSubmitActive] = useState(true);
  useEffect(() => {
    console.log(SubmitActive);
  }, [SubmitActive]);

  const handleVerifyEmailAndSendOtp = async (e: any) => {
    e.preventDefault();

    setSubmitActive(false);
    try {
      if (FieldData.email.length === 0) {
        setSubmitActive(true);
        return toast.error("Email not Provided");
      }
      const result = await apiFetch(
        `/api/user/checkemailandsendotp`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: FieldData.email }),
        }
      );
      const jsondata = await result;
      if (jsondata.success) {
        setShowPromptField(2);
        toast.success(jsondata.msg);
      } else {
        toast.error(jsondata.msg);
      }
    } catch (error) {
      console.log(error);
      toast.error("Internal Server Error");
    }

    setSubmitActive(true);
  };
  const [timeLimit, setTimeLimit] = useState(0);
  useEffect(() => {
    if (timeLimit > 0) {
      const timer = setInterval(() => {
        setTimeLimit((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [timeLimit]);

  const handleVerifyOtptoResetPassword = async (e: any) => {
    e.preventDefault();

    if (timeLimit > 0) return; // Prevent resending before timer ends
    setTimeLimit(5);

    setSubmitActive(false);
    try {
      if (FieldData.email.length === 0) {
        setSubmitActive(true);
        return toast.error("OTP not Provided");
      }

      const result = await apiFetch(
        `/api/user/verifyotptoresetpassword`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: FieldData.email,
            code: Number(FieldData.code),
          }),
        }
      );
      const jsondata = await result;
      if (jsondata.success) {
        setShowPromptField(3);
        toast.success(jsondata.msg);
      } else {
        toast.error(jsondata.msg);
      }
    } catch (error) {
      console.log(error);
      toast.error(`Internal Server Error `);
    }

    setSubmitActive(true);
  };
  const handleUpdatePassword = async (e: any) => {
    e.preventDefault();

    if (timeLimit > 0) return; // Prevent resending before timer ends
    setTimeLimit(5);
    setSubmitActive(false);
    try {
      if (FieldData.password.length === 0) {
        setSubmitActive(true);
        return toast.error("Password not Provided");
      }

      const result = await apiFetch(`/api/user/changepassword`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: FieldData.email,
          password: FieldData.password,
        }),
      });
      const jsondata = await result;
      if (jsondata.success) {
        dispatch(setUserDetail(jsondata.result));
        sessionStorage.setItem("token-", jsondata.result.token);
        toast.success(jsondata.msg);
        navigate("/login")
      } else {
        toast.error(jsondata.msg);
      }
    } catch (error) {
      console.log(error);
      toast.error(`Internal Server Error `);
    }
    setSubmitActive(true)
  };

  return (
    <>
      <div
        className="d-flex justify-content-center align-items-center vh-100"
        style={{
          backgroundImage: `url(${img})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="card p-4 shadow" style={{ width: "350px" }}>
          <div
            className="d-flex mb-4"
            style={{ flexDirection: "row", justifyContent: "center" }}
          >
            <img src={img2} style={{ height: "3pc", width: "3pc" }} alt="" />
          </div>
          <h4 className="text-center mb-3">Reset Your Password</h4>

          <form onSubmit={() => {}}>
            <div className={`d-${showPromptField === 1 ? "block" : "none"}`}>
              <label style={{ marginBottom: "3px" }} htmlFor="">
                Enter Your Verified Email Address:
              </label>
              <input
                type="email"
                name="email"
                id="email"
                style={{ border: "1px solid black" }}
                value={FieldData.email}
                onChange={(e) =>
                  setFieldData({ ...FieldData, email: e.target.value })
                }
              />
            </div>
            <div className={`d-${showPromptField === 2 ? "block" : "none"}`}>
              <label style={{ marginBottom: "3px" }} htmlFor="">
                Enter OTP:
              </label>
              <input
                type="text"
                name="otp1"
                id="otp1"
                style={{ border: "1px solid black" }}
                value={FieldData.code}
                onChange={(e) =>
                  setFieldData({ ...FieldData, code: e.target.value })
                }
              />
              <div
                className="d-flex mb-4"
                style={{ flexDirection: "row", justifyContent: "right" }}
                onClick={(e)=>{
                    handleVerifyEmailAndSendOtp(e)
                }}
              >
                <a
                  onClick={() => {}}
                  style={{
                    cursor: timeLimit === 0 ? "pointer" : "not-allowed",
                    color: timeLimit === 0 ? "blue" : "gray",
                  }}
                
                >
                  {timeLimit > 0 ? `${timeLimit} seconds` : "Resend Code"}
                </a>
              </div>
            </div>
            <div className={`d-${showPromptField === 3 ? "block" : "none"}`}>
              <label style={{ marginBottom: "3px" }} htmlFor="">
                New Password:
              </label>
              <input
                type="password"
                name="password"
                id="password"
                style={{ border: "1px solid black" }}
                value={FieldData.password}
                onChange={(e) =>
                  setFieldData({ ...FieldData, password: e.target.value })
                }
              />
            </div>
            <button
              className="btn btn-primary w-100 mt-3 "
              onClick={(e) => {
                if (showPromptField === 1) handleVerifyEmailAndSendOtp(e);
                if (showPromptField === 2) handleVerifyOtptoResetPassword(e);
                if (showPromptField === 3) handleUpdatePassword(e);
              }}
              disabled={!SubmitActive}
              type="submit"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default ForgetPassword;
