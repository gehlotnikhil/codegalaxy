import React, { useContext, useState } from "react";
import MainContext from "../context/main";

const EditProfile: React.FC = () => {
    const context = useContext(MainContext)
    const {profilePicture,setProfilePicture} = context
  const [name, setName] = useState<string>("Nikhil Gehlot");
  const [dob, setDob] = useState<string>("2005-08-15");
  const [gender, setGender] = useState<string>("male");
  const [deletePicture, setDeletePicture] = useState<boolean>(false);

  const handlePictureChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setProfilePicture(event.target.files[0]);
    }
  };

  const handleSave = () => {
    console.log({ name, dob, gender, deletePicture, profilePicture });
    alert("Profile saved successfully!");
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        color:"black"
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
                accept="image/jpeg,image/jpg,image/png"
                onChange={handlePictureChange}
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
                checked={deletePicture}
                onChange={() => setDeletePicture(!deletePicture)}
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
                value={name}
                onChange={(e) => setName(e.target.value)}
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

          {/* Date of Birth */}
          <div style={{ marginBottom: "15px" }}>
            <label>
              Your Date of Birth:
              <input
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
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
                    value="male"
                    checked={gender === "male"}
                    onChange={(e) => setGender(e.target.value)}
                  />
                  Male
                </label>
                <label>
                  <input
                    type="radio"
                    value="female"
                    checked={gender === "female"}
                    onChange={(e) => setGender(e.target.value)}
                  />
                  Female
                </label>
               
              </div>
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
