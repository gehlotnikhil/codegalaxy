import React, { useContext, useEffect, useState } from "react";
import MainContext from "../context/main";

interface EditProfileProps {
  display?: string;
}

const EditProfile: React.FC<EditProfileProps> = (prop) => {
  const context = useContext(MainContext);
  const { profilePicture, setProfilePicture } = context;
  const [name, setName] = useState<string>("Nikhil Gehlot");
  const [age, setAge] = useState<number>(0);
  const [gender, setGender] = useState<string>("male");
  const [deletePicture, setDeletePicture] = useState<boolean>(false);
  const user = JSON.parse(localStorage.getItem("User") || "null");

  const [FieldValue, setFieldValue] = useState({
    profilePictureUrl: user.profilePictureUrl || "",
    name: user.name || "",
    age: user.age || 0,
    email: user.email || "",
    password: user.password || "",
    userName: user.userName || "",
    gender: user.gender || "",
    collegeName: user.collegeName || "",
    state: user.state || "",
    country: user.country || "",
    deleteProfileChecked: false,
  });
  console.log("->", FieldValue);

  useEffect(() => {
    console.log("->", FieldValue);
  }, [FieldValue]);

  const handleFieldValueChange = (e: any) => {};

  const handlePictureChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setProfilePicture(event.target.files[0]);
    }
  };

  const handleSave = () => {
    console.log({ name, age, gender, deletePicture, profilePicture });
    alert("Profile saved successfully!");
  };

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
          width: "700px",
          backgroundColor: "#ffffff",
          border: "1px solid #ddd",
          borderRadius: "8px",
          boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
          padding: "20px",
        }}
      >
        <h2 style={{ marginBottom: "20px" }}>Edit Profile</h2>
        <form>
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
                    [e.target.name]: e.target.value,
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
                value={FieldValue.name}
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
                value={FieldValue.age!==0?FieldValue.age:0}
                onChange={(e) => {
                  const value = Number.parseInt(e.target.value)
                  if(value >=1 && value <=100){
                    setFieldValue({
                      ...FieldValue,
                      [e.target.name]: e.target.value,
                    });
                  }else if(value <1){
                    setFieldValue({
                      ...FieldValue,
                      [e.target.name]:1
                    });
                  
                  }else if(value >100){
                    setFieldValue({
                      ...FieldValue,
                      [e.target.name]:100
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
                    name = "collegeName"
                value={FieldValue.collegeName}
                onChange={(e) =>     setFieldValue({ ...FieldValue, [e.target.name]: e.target.value }) }
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
                value={FieldValue.state}
                onChange={(e) =>     setFieldValue({ ...FieldValue, [e.target.name]: e.target.value }) }
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
                value={FieldValue.country}
                onChange={(e) =>     setFieldValue({ ...FieldValue, [e.target.name]: e.target.value }) }
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
                value={FieldValue.userName}
                onChange={(e) =>     setFieldValue({ ...FieldValue, [e.target.name]: e.target.value }) }
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
                type="text"
                name="email"
                value={FieldValue.email}
                onChange={(e) =>     setFieldValue({ ...FieldValue, [e.target.name]: e.target.value }) }
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

          {/* Set New Password */}
          <div style={{ marginBottom: "15px" }}>
            <label>
              Set New Password: <span style={{ color: "red" }}>*</span>
              <input
                type="text"
                name="password"
                value={FieldValue.password}
                onChange={(e) => handleFieldValueChange(e.target)}
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

          {/* Save Button */}
          <div>
            <button
              type="button"
              onClick={handleSave}
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
