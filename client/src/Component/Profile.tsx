import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
// import Button from "react-bootstrap/Button";
import { useContext } from "react";
import MainContext from "../context/main";
import EditProfile from "./EditProfile";
import { useSelector } from "react-redux";
import { RootStateType } from "../store";
// import ProgressCircle from "./ProgressData";
// import MultiSegmentCircle from "./MultiSegmentCircle";
import ProgressCircle2 from "./ProgressCircle2";
import RatingDisplay from "./RatingDisplay";
import SubmissionGraph from "./SubmissionGraph";

function Profile() {

  const context = useContext(MainContext);
  const userDetail = useSelector((state: RootStateType) => {
    return state.userDetail;
  });
  const { handleShowProfileToggle, ShowEditProfile, ShowProfile,defaultProfilePicture } = context;
  const {  } = context;






  return (
    <>
      <EditProfile display={`${ShowEditProfile === true ? "flex" : "none"}`} />
      <section
        className={`color-1 d-${ShowProfile === true ? "block" : "none"}`}
      >
        <div className="container py-2">
          <div className="row">
            <div className="col-lg-8">
              <div className="card mb-4 position-relative">
                {/* Edit Icon */}
                <FontAwesomeIcon
                  icon={faEdit}
                  className="position-absolute"
                  style={{
                    top: "10px",
                    right: "10px",
                    cursor: "pointer",
                    fontSize: "20px",
                  }}
                  onClick={() => {
                    handleShowProfileToggle();
                  }} // Optional: Trigger edit functionality
                />
                <div className="card-body">
                  <div className="row">
                    <div className="col-sm-3">
                      <p className="mb-0" >
                        <img
                  src={`${userDetail.profilePictureUrl===defaultProfilePicture?defaultProfilePicture:userDetail.profilePictureUrl}`} 
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
                        {userDetail.name}
                      </p>
                    </div>
                  </div>
                  <hr />
                  <div className="row">
                    <div className="col-sm-3">
                      <p className="mb-0">Username: </p>
                    </div>
                    <div className="col-sm-9">
                      <p className="text-muted mb-0">{userDetail.userName}</p>
                    </div>
                  </div>
                  <hr />
                  <div className="row">
                    <div className="col-sm-3">
                      <p className="mb-0">Email</p>
                    </div>
                    <div className="col-sm-9">
                      <p className="text-muted mb-0">{userDetail.email}</p>
                    </div>
                  </div>
                  <hr />
                  <div className="row">
                    <div className="col-sm-3">
                      <p className="mb-0">College Name</p>
                    </div>
                    <div className="col-sm-9">
                      <p className="text-muted mb-0">
                        {userDetail.collegeName === "" ||
                        userDetail.collegeName === null
                          ? "Not Specified"
                          : userDetail.collegeName}
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
                        {userDetail.state === "" || userDetail.state === null
                          ? "Not Specified"
                          : userDetail.state}
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
                        {userDetail.country === "" ||
                        userDetail.country === null
                          ? "Not Specified"
                          : userDetail.country}
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
                  <RatingDisplay number={userDetail.totalRank} />
                  <p
                    className="my-3 text-primary"
                    style={{ textDecoration: "underline" }}
                  >
                    Codegalaxy Rating
                  </p>
                  <p className="text-muted mb-1">{userDetail.userName}</p>
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
