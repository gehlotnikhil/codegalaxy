import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
// import Button from "react-bootstrap/Button";
import { useContext, useEffect, useState } from "react";
import MainContext from "../context/main";
import { apiFetch } from '../utils/api';

// import ProgressCircle from "./ProgressData";
// import MultiSegmentCircle from "./MultiSegmentCircle";
import ProgressCircle2 from "./ProgressCircle2";
import RatingDisplay from "./RatingDisplay";
import SubmissionGraph from "./SubmissionGraph";
import { useLocation, useNavigate, useParams } from "react-router";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { RootStateType } from "../store";
function Profile() {
  const paramUsername = useParams();
  const context = useContext(MainContext);
  const userDetail = useSelector((state: RootStateType) => state.userDetail);
  const navigate = useNavigate();
  const locationHook = useLocation();
  const [ProfileData, setProfileData] = useState({
    profilePictureUrl: "",
    name: "",
    userName: "",
    email: "",
    collegeName: "",
    state: "",
    country: "",
    linkedin_url: "",
    totalRank: 1000,
    easy: 0,
    medium: 0,
    hard: 0,
    totalNumberOfQuestion: 0,
    solvedProblemDetails: [],
    activeDays: [],
  });


  useEffect(() => {
    console.log("ProfileData--", ProfileData);
    setEditButtonDisplay(() => {
      if (userDetail.userName === ProfileData.userName) return true;
      return false;
    });
  }, [ProfileData]);

  const [EditButtonDisplay, setEditButtonDisplay] = useState(true);
  useEffect(() => {
    console.log("EditButtonDisplay--", EditButtonDisplay);
  }, [EditButtonDisplay]);

  const { defaultProfilePicture } = context;

  const loadProfileDetailFromUserName = async (userName: string) => {
    const result = await apiFetch(`/api/user/usernametodata`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userName: userName,
      }),
    });
    const jsondata = await result;
    console.log("loadProfileDetailFromUserName-", jsondata);
    if (jsondata.success) {
      const result2 = await apiFetch(
        `/api/problemset/getallproblem/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            accepted: 1,
            submission: 1,
            id: 1,
          }),
        }
      );
      let easy = 0;
      let medium = 0;
      let hard = 0;
      const jsondata2 = await result2;
      console.log(jsondata2);
      if (jsondata2.success) {
        let problems = jsondata2.result;
        console.log("i am at here 1 -", jsondata.result.solvedProblemDetails);

        (jsondata.result.solvedProblemDetails || []).forEach((id: string) => {
          let found = problems.find((item: any) => item.id === id);
          if (found) {
            let percentage = (found.accepted / found.submission) * 100;

            if (percentage >= 75 && percentage <= 100) {
              easy++;
            } else if (percentage >= 50 && percentage <= 74) {
              medium++;
            } else {
              hard++;
            }
          }
        });
      }

      const id = jsondata.result.id
      console.log("id - - ",id);
      const response2 = await apiFetch(`/api/contest/getcontestrank/${userDetail.id}`,{
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
      const jsondata3 = await response2
      if(jsondata3.success){
        setProfileData({...ProfileData,totalRank:jsondata3.result})
      }
      

      setProfileData((e)=>({
        ...e,
        profilePictureUrl: jsondata.result.profilePictureUrl,
        name: jsondata.result.name,
        userName: jsondata.result.userName,
        email: jsondata.result.email,
        collegeName: jsondata.result.collegeName,
        state: jsondata.result.state,
        country: jsondata.result.country,
        linkedin_url: jsondata.result.linkedin_url,
        activeDays: jsondata.result.activeDays,
        solvedProblemDetails: jsondata.result.solvedProblemDetails,
        totalNumberOfQuestion: jsondata2.result.length,
        easy,
        medium,
        hard,
      }));
    } else {
      toast.error(`${userName} Username not exist`);
    }
  };
  useEffect(() => {
    console.log(
      "profile--",
      paramUsername.username,
      "---------",
      locationHook.pathname
    );
    if (locationHook.pathname.startsWith("/u/")) {
      loadProfileDetailFromUserName(paramUsername.username || "");
    }
  }, [locationHook]);

  useEffect(() => {}, []);

  return (
    <>
      {/* <EditProfile display={`${ShowEditProfile === true ? "flex" : "none"}`} /> */}
      <section className={`color-1`}>
        <div className="container py-2">
          <div className="row">
            <div className="col-lg-8">
              <div className="card mb-4 position-relative">
                {/* Edit Icon */}
                {EditButtonDisplay && (
                  <>
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
                        navigate("/edit");
                      }} // Optional: Trigger edit functionality
                    />
                  </>
                )}
                <div className="card-body">
                  <div className="row">
                    <div className="col-sm-3">
                      <p className="mb-0">
                        <img
                          src={`${
                            ProfileData.profilePictureUrl ===
                            defaultProfilePicture
                              ? defaultProfilePicture
                              : ProfileData.profilePictureUrl
                          }`}
                          style={{
                            border: "1px",
                            borderColor: "black",
                            borderStyle: "dotted",
                          }}
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
                  <hr />
                  <div className="row">
                    <div className="col-sm-3">
                      <p className="mb-0">Linkedin Url:</p>
                    </div>
                    <div className="col-sm-9">
                      <p className="text-muted mb-0">
                        {ProfileData.linkedin_url === "" ||
                        ProfileData.linkedin_url === null
                          ? "Not Specified"
                          : ProfileData.linkedin_url}
                      </p>
                    </div>
                  </div>
                </div>
                <hr />
                <div className="">
                  <SubmissionGraph activeDays={ProfileData.activeDays} />
                  {/* activeDays= [{
           290, 159, 26, 98, 18, 96, 211, 53, 29, 296, 155, 75, 213, 4, 148, 95,
           10, 49, 275, 21, 142, 253, 134, 274, 114, 88, 6, 131, 351, 225, 176,
           166, 121, 319, 364, 85, 74, 195, 202, 138, 264, 361, 7, 103, 123, 310,
           108, 272, 58, 39, 332, 362, 324, 292, 143, 358, 239, 99, 167, 360, 97,
           189, 45, 335, 150,
         ]} */}
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
                  <ProgressCircle2
                    easy={ProfileData.easy}
                    medium={ProfileData.medium}
                    hard={ProfileData.hard}
                    totalNumberOfQuestion={ProfileData.totalNumberOfQuestion}
                  />
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
