import React, { useContext, useEffect, useState } from "react";
import MainContext from "../context/main";
import { useNavigate } from "react-router";

interface EditProfileProps {
  display?: string;
}

const EditProfile: React.FC<EditProfileProps> = (prop) => {
  function handleChangeProfileImage(profilePictureUrl: any): any {
    return profilePictureUrl
  }
  // const navigate = useNavigate();

  const context = useContext(MainContext);
  const { handleShowProfileToggle ,updateProfileInformation} = context;

  // const { profilePicture, setProfilePicture } = context;
  const user = JSON.parse(localStorage.getItem("User") || "null");
  const [passwordWarning, setPasswordWarning] = useState("none");
  const [FieldValue, setFieldValue] = useState({
    profilePictureUrl: user.profilePictureUrl || null,
    name: user.name || null,
    age: user.age || null,
    email: user.email || null,
    password: user.password || null,
    userName: user.userName || null,
    gender: user.gender || null,
    collegeName: user.collegeName || null,
    state: user.state || null,
    country: user.country || null,
    deleteProfileChecked: false,
  });
  const handleSave = (e: any) => {
    e.preventDefault();
    const query: {
      profilePictureUrl?: any;
      name?: string;
      age?: string;
      email?: string;
      password?: string;
      userName?: string;
      gender?: string;
      collegeName?: string;
      state?: string;
      country?: string;
      deleteProfileChecked?: boolean;
    } = {};
    if (FieldValue.name !== null || FieldValue.name !== user.name) {
      query.name = FieldValue.name;
    }
    if (FieldValue.age !== null || FieldValue.age !== user.age) {
      query.age = FieldValue.age;
    }
    if (FieldValue.email !== null || FieldValue.email !== user.email) {
      query.email = FieldValue.email;
    }
    if (FieldValue.password !== null || FieldValue.password !== user.password) {
      query.password = FieldValue.password;
    }
    if (FieldValue.userName !== null || FieldValue.userName !== user.userName) {
      query.userName = FieldValue.userName;
    }
    if (FieldValue.gender !== null || FieldValue.gender !== user.gender) {
      query.gender = FieldValue.gender;
    }
    if (
      FieldValue.collegeName !== null ||
      FieldValue.collegeName !== user.collegeName
    ) {
      query.collegeName = FieldValue.collegeName;
    }
    if (FieldValue.state !== null || FieldValue.state !== user.state) {
      query.state = FieldValue.state;
    }
    if (FieldValue.country !== null || FieldValue.country !== user.country) {
      query.country = FieldValue.country;
    }
    if (FieldValue.profilePictureUrl !== null || FieldValue.profilePictureUrl !== user.profilePictureUrl) {
      query.profilePictureUrl = handleChangeProfileImage(FieldValue.profilePictureUrl)
    }
    if (
      FieldValue.deleteProfileChecked !== null ||
      FieldValue.deleteProfileChecked !== user.deleteProfileChecked
    ) {
      query.deleteProfileChecked = handleChangeProfileImage("default")
      
    }
    updateProfileInformation(query)
    alert("Profile saved successfully!");
    handleShowProfileToggle();
  };
  console.log("->", FieldValue);

  useEffect(() => {
    console.log("->", FieldValue);
  }, [FieldValue]);

  const handleFieldValueChange = (e: any) => {};

  return (
    <div
      style={{
        display: `${prop?.display === "none" ? "none" : "flex"}`,
        justifyContent: "center",
        alignItems: "center",

        color: "black",
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
            handleShowProfileToggle();
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
        <form onSubmit={(e) => handleSave(e)}>
          {/* Upload Profile Picture */}
          <div style={{ marginBottom: "15px" }}>
            <label>
              Upload picture of yourself:
              <input
                type="file"
                name="profilePictureUrl"
                accept="image/jpeg,image/jpg,image/png"
                onChange={(e) =>
                  setFieldValue({
                    ...FieldValue,
                    [e.target.name]: e.target.files ? e.target.files[0] : null,
                  })
                }
                style={{
                  display: "block",
                  marginTop: "8px",
                }}
              />
            </label>
          </div>
          <div style={{ marginBottom: "15px" }}>
            <label>
              Delete Profile Picture
              <input
                type="checkbox"
                name="deleteProfileChecked"
                onChange={(e) =>
                  setFieldValue({
                    ...FieldValue,
                    [e.target.name]: e.target.checked,
                  })
                }
              />
            </label>
            <p style={{ fontSize: "12px", color: "gray", margin: 0 }}>
              Tick the checkbox if you want to delete your current profile
              picture.
            </p>
          </div>

          {/* Name */}
          <div style={{ marginBottom: "15px" }}>
            <label>
              Your Name: <span style={{ color: "red" }}>*</span>
              <input
                type="text"
                name="name"
                value={FieldValue.name !== null ? FieldValue.name : ""}
                onChange={(e) =>
                  setFieldValue({
                    ...FieldValue,
                    [e.target.name]: e.target.value,
                  })
                }
                style={{
                  width: "100%",
                  padding: "10px",
                  marginTop: "5px",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                }}
              />
            </label>
          </div>

          {/* Age */}
          <div style={{ marginBottom: "15px" }}>
            <label>
              Your Age: <span style={{ color: "red" }}>*</span>
              <input
                type="number"
                min={"0"}
                max={"100"}
                name="age"
                value={FieldValue.age !== null ? FieldValue.age : 0}
                onChange={(e) => {
                  const value = Number.parseInt(e.target.value);
                  if (value >= 1 && value <= 100) {
                    setFieldValue({
                      ...FieldValue,
                      [e.target.name]: e.target.value,
                    });
                  } else if (value < 1) {
                    setFieldValue({
                      ...FieldValue,
                      [e.target.name]: 1,
                    });
                  } else if (value > 100) {
                    setFieldValue({
                      ...FieldValue,
                      [e.target.name]: 100,
                    });
                  }
                }}
                style={{
                  width: "100%",
                  padding: "10px",
                  marginTop: "5px",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                }}
              />
            </label>
          </div>

          {/* Gender */}
          <div style={{ marginBottom: "15px" }}>
            <label>
              Gender:
              <div>
                <label style={{ marginLeft: "10px" }}>
                  <input
                    type="radio"
                    name="gender"
                    value="male"
                    checked={
                      FieldValue.gender !== ""
                        ? FieldValue.gender === "male"
                        : false
                    }
                    onChange={(e) =>
                      setFieldValue({
                        ...FieldValue,
                        [e.target.name]: e.target.value,
                      })
                    }
                  />
                  Male
                </label>
                <label>
                  <input
                    type="radio"
                    value="female"
                    name="gender"
                    checked={
                      FieldValue.gender !== ""
                        ? FieldValue.gender === "female"
                        : false
                    }
                    onChange={(e) =>
                      setFieldValue({
                        ...FieldValue,
                        [e.target.name]: e.target.value,
                      })
                    }
                  />
                  Female
                </label>
              </div>
            </label>
          </div>

          {/* collegename */}
          <div style={{ marginBottom: "15px" }}>
            <label>
              Enter your College Name:
              <input
                type="text"
                name="collegeName"
                value={
                  FieldValue.collegeName !== null ? FieldValue.collegeName : ""
                }
                onChange={(e) =>
                  setFieldValue({
                    ...FieldValue,
                    [e.target.name]: e.target.value,
                  })
                }
                style={{
                  width: "100%",
                  padding: "10px",
                  marginTop: "5px",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                }}
              />
            </label>
          </div>

          {/* State */}
          <div style={{ marginBottom: "15px" }}>
            <label>
              Enter your State: <span style={{ color: "red" }}>*</span>
              <input
                type="text"
                name="state"
                value={FieldValue.state !== null ? FieldValue.state : ""}
                onChange={(e) =>
                  setFieldValue({
                    ...FieldValue,
                    [e.target.name]: e.target.value,
                  })
                }
                style={{
                  width: "100%",
                  padding: "10px",
                  marginTop: "5px",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                }}
              />
            </label>
          </div>

          {/* Country */}
          <div style={{ marginBottom: "15px" }}>
            <label>
              Enter your Country: <span style={{ color: "red" }}>*</span>
              <input
                type="text"
                name="country"
                value={FieldValue.country !== null ? FieldValue.country : ""}
                onChange={(e) =>
                  setFieldValue({
                    ...FieldValue,
                    [e.target.name]: e.target.value,
                  })
                }
                style={{
                  width: "100%",
                  padding: "10px",
                  marginTop: "5px",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                }}
              />
            </label>
          </div>

          {/* UserName */}
          <div style={{ marginBottom: "15px" }}>
            <label>
              UserName: <span style={{ color: "red" }}>*</span>
              <input
                type="text"
                name="userName"
                value={FieldValue.userName !== null ? FieldValue.userName : ""}
                onChange={(e) =>
                  setFieldValue({
                    ...FieldValue,
                    [e.target.name]: e.target.value,
                  })
                }
                style={{
                  width: "100%",
                  padding: "10px",
                  marginTop: "5px",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                }}
              />
            </label>
          </div>

          {/* New Email */}
          <div style={{ marginBottom: "15px" }}>
            <label>
              Set New Email: <span style={{ color: "red" }}>*</span>
              <input
                type="email"
                name="email"
                value={FieldValue.email !== null ? FieldValue.email : ""}
                onChange={(e) =>
                  setFieldValue({
                    ...FieldValue,
                    [e.target.name]: e.target.value,
                  })
                }
                style={{
                  width: "100%",
                  padding: "10px",
                  marginTop: "5px",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                }}
                required
              />
            </label>
          </div>

          {/* Set New Password */}

          <div style={{ marginBottom: "15px" }}>
            <label>
              Set New Password: <span style={{ color: "red" }}>*</span>
              <input
                type="text"
                name="password"
                onChange={(e) => {
                  if (e.target.value.length < 5) {
                    return setPasswordWarning("block");
                  }
                  setPasswordWarning("none");
                  setFieldValue({
                    ...FieldValue,
                    [e.target.name]: e.target.value,
                  });
                }}
                style={{
                  width: "100%",
                  padding: "10px",
                  marginTop: "5px",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                }}
              />
            </label>
            <p className={`d-${passwordWarning}`}>
              <span style={{ color: "red" }}>*</span>Password length should be
              more than 5<span style={{ color: "red" }}>*</span>
            </p>
          </div>

          {/* Save Button */}
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


