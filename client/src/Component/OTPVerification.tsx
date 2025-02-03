import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import img from "../assets/img7.jpg"
const OTPVerification: React.FC = () => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);

  const handleChange = (index: number, value: string) => {
    if (/^\d?$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
    }
  };




  
  return (
    <div
      className=" d-flex justify-content-center align-items-center vh-100"
      style={{
        backgroundImage: `url(${img})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="card p-4 shadow" style={{ width: "350px" }}>
        <h4 className="text-center mb-3">OTP Verification</h4>
        <p className="text-muted text-center">
          Enter OTP Code sent to +880*******x2
        </p>
        <form action="">
        <div className="d-flex justify-content-between">
          {otp.map((digit, index) => (
            <input
              key={index}
              type="text"
              maxLength={1}
              className="form-control text-center"
              style={{ width: "40px", fontSize: "20px",border:"1px solid black" }}
              value={digit}
              required
              onChange={(e) => handleChange(index, e.target.value)}
            />
          ))}
        </div>
        <p className="text-center text-muted mt-3">
          Didn’t receive OTP? <a href="#">Resend Code</a>
        </p>
        <button className="btn btn-primary w-100 mt-3" type="submit">Verify & Proceed</button>
        </form>
      </div>
    </div>
  );
};

export default OTPVerification;
