import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
// import Button from "react-bootstrap/Button";
import { useContext, useEffect, useState } from "react";
import MainContext from "../context/main";
// import ProgressCircle from "./ProgressData";
// import MultiSegmentCircle from "./MultiSegmentCircle";
import ProgressCircle2 from "./ProgressCircle2";
import RatingDisplay from "./RatingDisplay";
import SubmissionGraph from "./SubmissionGraph";
import { useLocation, useNavigate, useParams } from "react-router";
import {toast} from "react-toastify"
import { useSelector } from "react-redux";
import { RootStateType } from "../store";
function Profile() {
const paramUsername = useParams()
  const context = useContext(MainContext);
  const {ServerUrl} = context
  const userDetail = useSelector((state:RootStateType)=>state.userDetail)
  const navigate = useNavigate();
  const locationHook = useLocation()
  const [ProfileData, setProfileData] = useState({
    profilePictureUrl:"",
    name:"",
    userName:"",
    email:"",
    collegeName:"",
    state:"",
    country:"",
    totalRank:0
  })
  useEffect(() => {
    console.log("ProfileData--",ProfileData);
    setEditButtonDisplay(()=>{
      if(userDetail.userName === ProfileData.userName)
        return true;
      return false
    })
  }, [ProfileData])
  
  const [EditButtonDisplay, setEditButtonDisplay] = useState(true)
useEffect(() => {
  
  console.log("EditButtonDisplay--",EditButtonDisplay);
  
}, [EditButtonDisplay])

  const {defaultProfilePicture } = context;

  const loadProfileDetailFromUserName = async(userName:string)=>{
    const result = await fetch(`${ServerUrl}/api/user/usernametodata`,{
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        "userName":userName
      }),
    });
    const jsondata = await result.json();
    console.log("loadProfileDetailFromUserName-",jsondata)
    if(jsondata.success){
      setProfileData({
        profilePictureUrl:jsondata.result.profilePictureUrl,
        name:jsondata.result.name,
        userName:jsondata.result.userName,
        email:jsondata.result.email,
        collegeName:jsondata.result.collegeName,
        state:jsondata.result.state,
        country:jsondata.result.country,
        totalRank:jsondata.result.totalRank
      })
    }else{
      toast.error(`${userName} Username not exist`)
    }
  }
useEffect(() => {
  console.log("profile--",paramUsername.username,"---------",locationHook.pathname);
  if(locationHook.pathname.startsWith("/u/")){
    loadProfileDetailFromUserName(paramUsername.username || "")
    
  }
  
}, [locationHook])





  return (
    <>
      {/* <EditProfile display={`${ShowEditProfile === true ? "flex" : "none"}`} /> */}
      <section
        className={`color-1`}
      >
        <div className="container py-2">
          <div className="row">
            <div className="col-lg-8">
              <div className="card mb-4 position-relative">
                {/* Edit Icon */}
                {
                 EditButtonDisplay && <>
                <FontAwesomeIcon
                  icon={faEdit}
                  className={`position-absolute `}
                  style={{
                    top: "10px",
                    right: "10px",
                    cursor: "pointer",
                    fontSize: "20px",
                  }}
                  onClick={() => {
                    navigate("/edit")
                  }} // Optional: Trigger edit functionality
                />
                </>
}
                <div className="card-body">
                  <div className="row">
                    <div className="col-sm-3">
                      <p className="mb-0" >
                        <img
                  src={`${ProfileData.profilePictureUrl===defaultProfilePicture?defaultProfilePicture:ProfileData.profilePictureUrl}`} 
                  style={{border:"1px",borderColor:"black",borderStyle:"dotted"}}
                          height={"75px"}
                          width={"60px"}
                          alt=""
                        />
                      </p>
                    </div>
                    <div className="col-sm-9">
                      <p
                        className="text-muted mb-0"
                        style={{ fontSize: "45px", fontFamily: "emoji" }}
                      >
                        {ProfileData.name}
                      </p>
                    </div>
                  </div>
                  <hr />
                  <div className="row">
                    <div className="col-sm-3">
                      <p className="mb-0">Username: </p>
                    </div>
                    <div className="col-sm-9">
                      <p className="text-muted mb-0">{ProfileData.userName}</p>
                    </div>
                  </div>
                  <hr />
                  <div className="row">
                    <div className="col-sm-3">
                      <p className="mb-0">Email</p>
                    </div>
                    <div className="col-sm-9">
                      <p className="text-muted mb-0">{ProfileData.email}</p>
                    </div>
                  </div>
                  <hr />
                  <div className="row">
                    <div className="col-sm-3">
                      <p className="mb-0">College Name</p>
                    </div>
                    <div className="col-sm-9">
                      <p className="text-muted mb-0">
                        {ProfileData.collegeName === "" ||
                        ProfileData.collegeName === null
                          ? "Not Specified"
                          : ProfileData.collegeName}
                      </p>
                    </div>
                  </div>
                  <hr />
                  <div className="row">
                    <div className="col-sm-3">
                      <p className="mb-0">State</p>
                    </div>
                    <div className="col-sm-9">
                      <p className="text-muted mb-0">
                        {ProfileData.state === "" || ProfileData.state === null
                          ? "Not Specified"
                          : ProfileData.state}
                      </p>
                    </div>
                  </div>
                  <hr />
                  <div className="row">
                    <div className="col-sm-3">
                      <p className="mb-0">Country</p>
                    </div>
                    <div className="col-sm-9">
                      <p className="text-muted mb-0">
                        {ProfileData.country === "" ||
                        ProfileData.country === null
                          ? "Not Specified"
                          : ProfileData.country}
                      </p>
                    </div>
                  </div>
                </div>
                <hr />
                <div className="">
                <SubmissionGraph
        activeDays={[
          290, 159, 26, 98, 18, 96, 211, 53, 29, 296, 155, 75, 213, 4, 148, 95,
          10, 49, 275, 21, 142, 253, 134, 274, 114, 88, 6, 131, 351, 225, 176,
          166, 121, 319, 364, 85, 74, 195, 202, 138, 264, 361, 7, 103, 123, 310,
          108, 272, 58, 39, 332, 362, 324, 292, 143, 358, 239, 99, 167, 360, 97,
          189, 45, 335, 150,
        ]}
      />
                </div>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="card mb-4" style={{ paddingBottom: "1.07pc" }}>
                <div className="card-body text-center mt-4">
                  <RatingDisplay number={ProfileData.totalRank} />
                  <p
                    className="my-3 text-primary"
                    style={{ textDecoration: "underline" }}
                  >
                    Codegalaxy Rating
                  </p>
                  <p className="text-muted mb-1">{ProfileData.userName}</p>
                  <hr />
                  <ProgressCircle2 easy={1} medium={1} hard={1} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
     
    </>
  );
}

export default Profile;
