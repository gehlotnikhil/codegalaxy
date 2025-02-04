import React, { useContext, useEffect, useState } from "react";

import MainContext from "../context/main";
// import { yupResolver } from "@hookform/resolvers/yup";
// import * as yup from "yup";
import { useForm, SubmitHandler } from "react-hook-form";
import { useSelector } from "react-redux";
import { RootStateType } from "../store";
import { EntireUserDetailType } from "../store/slice/UserDetailSlice";
import axios from "axios";
import {  useNavigate } from "react-router";


interface ProfileFieldValueType {
  name: string;
  age?: number;
  email: string;
  userName: string;
  state:string;
  country:string;
  linkedin_url:string;
  // gender?: string;
  collegeName: string;
  // state?: string;
  // country?: string;
  // deleteProfileChecked?: boolean;
  profilePictureUrl?: string;
}

const EditProfile: React.FC = () => {
  const navigate= useNavigate()
  
  // const dispatch = useDispatch()
  const userDetail: EntireUserDetailType = useSelector(
    (state: RootStateType): EntireUserDetailType => {
      return state.userDetail;
    }
  );

  useEffect(() => {
    console.log("loading token-",userDetail);
      }, [])
  const { 
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFieldValueType>({
    defaultValues: {
      name: userDetail.name || "", // Fallback to empty string
      age: userDetail.age ?? 0, // Allow null for optional fields
      userName: userDetail.userName || "",
      email: userDetail.email || "",
      state:userDetail.state || "",
      country:userDetail.country || "",
      linkedin_url:userDetail.linkedin_url || "",
      collegeName:userDetail.collegeName || ""
    },
  });
  function trimUrlExtension(url: any) {
    const lastDotIndex = url.lastIndexOf('.');
    const lastSlashIndex = url.lastIndexOf('/');
    if (lastDotIndex > lastSlashIndex) {
      return url.substring(0, lastDotIndex);
    }
    return url;
  }
  const context = useContext(MainContext);
  const {  updateProfileInformation } = context;

  const onSubmit: SubmitHandler<ProfileFieldValueType> = async (data) => {
    console.log("Form data:", data);
    if (file !== null) {
      let profilePictureUrl = await handleUpload();
      data = { ...data, profilePictureUrl: profilePictureUrl }
    }
    console.log("last--------------", data);

    updateProfileInformation(data);
    // Handle form submission logic here
  };

  const CLOUD_NAME = "diqpelkm9"; // Replace with your Cloudinary cloud name
  const CLOUDINARY_UPLOAD_PRESET = "my_present";
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState("");
  useEffect(() => {
    console.log(file);
  }, [file]);
  useEffect(() => {
    console.log(error);
  }, [error]);

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a file.");
      return;
    }

    setError("");
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

    try {
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        formData
      );
      let uploadedImageUrl = response.data.secure_url;

      console.log("etannnnnnnn->>>", trimUrlExtension(uploadedImageUrl));
      uploadedImageUrl = trimUrlExtension(uploadedImageUrl)
      let starting = () => {
        let b = uploadedImageUrl.substring(50, uploadedImageUrl.length);
        console.log(b.indexOf("/"));
        return b.indexOf("/");
      };
      uploadedImageUrl = uploadedImageUrl.substring(51 + starting());
      let newurl =
        "https://res.cloudinary.com/diqpelkm9/image/upload/f_auto,q_auto/" + uploadedImageUrl;
      console.log("etannnnnnnn->>>", newurl);
      console.log("new", newurl);

      return newurl
    } catch (error) {
      console.error("Error uploading image:", error);
      setError("Image upload failed. Please try again.");
    }
  };

  return (
    <div
      style={{
        display:"flex",
        justifyContent: "center",
        alignItems: "center",
        color: "black",
        backgroundColor:"#1b1919"
      }}
    >
      <div
        style={{
          position: "relative",
          width: "700px",
          backgroundColor: "#ffffff",
          border: "1px solid #ddd",
          borderRadius: "8px",
          boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
          padding: "20px",
        }}
      >
        {/* Close Button */}
        <button
          className="profile-close-btn"
          onClick={() => {
            navigate(`/u/${userDetail.userName}`);
          }}
          style={{
            position: "absolute",
            top: "10px",
            right: "20px",
            backgroundColor: "transparent",
            fontSize: "30px",
            cursor: "pointer",
            color: "#333",
            border: "none",
          }}
          aria-label="Close"
        >
          &times;
        </button>
        <h2 style={{ marginBottom: "20px" }}>Edit Profile</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Upload profile image */}
          <div style={{ marginBottom: "15px" }}>
            <label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files) setFile(e.target.files[0]);
                }}
              />{" "}
            </label>
            <p className="error-message">{errors.name?.message}</p>
          </div>
          {/* Name */}
          <div style={{ marginBottom: "15px" }}>
            <label>
              Your Name: <span style={{ color: "red" }}>*</span>
              <input type="text" {...register("name")} />
            </label>
            <p className="error-message">{errors.name?.message}</p>
          </div>

          {/* Age */}
          <div style={{ marginBottom: "15px" }}>
            <label>
              Your Age:
              <input type="number" {...register("age")} />
            </label>
            <p className="error-message">{errors.age?.message}</p>
          </div>

          {/* Email */}
          <div style={{ marginBottom: "15px" }}>
            <label>
              Set New Email: <span style={{ color: "red" }}>*</span>
              <input type="email" {...register("email")} />
            </label>
            <p className="error-message">{errors.email?.message}</p>
          </div>

          {/* Username */}
          <div style={{ marginBottom: "15px" }}>
            <label>
              Set New Username: <span style={{ color: "red" }}>*</span>
              <input type="text" {...register("userName")} />
            </label>
            <p className="error-message">{errors.userName?.message}</p>
          </div>

          {/* CollegeName */}
          <div style={{ marginBottom: "15px" }}>
            <label>
              Set College Name: <span style={{ color: "red" }}>*</span>
              <input type="text" {...register("collegeName")} />
            </label>
            <p className="error-message">{errors.collegeName?.message}</p>
          </div>
          {/* State */}
          <div style={{ marginBottom: "15px" }}>
            <label>
              Set State: <span style={{ color: "red" }}>*</span>
              <input type="text" {...register("state")} />
            </label>
            <p className="error-message">{errors.state?.message}</p>
          </div>

          {/* Country */}
          <div style={{ marginBottom: "15px" }}>
            <label>
              Set Country: <span style={{ color: "red" }}>*</span>
              <input type="text" {...register("country")} />
            </label>
            <p className="error-message">{errors.country?.message}</p>
          </div>

          {/* linkedin_url */}
          <div style={{ marginBottom: "15px" }}>
            <label>
              Set Linkedin_url: <span style={{ color: "red" }}>*</span>
              <input type="text" {...register("linkedin_url")} />
            </label>
            <p className="error-message">{errors.linkedin_url?.message}</p>
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              style={{
                backgroundColor: "#007bff",
                color: "white",
                padding: "10px 20px",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                width: "100%",
                fontSize: "16px",
              }}
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;
