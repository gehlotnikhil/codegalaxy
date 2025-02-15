import  { useContext, useEffect, useState } from "react";
import img from "../assets/logo.png";
import { useSelector } from "react-redux";
import { RootStateType } from "../store";
import MainContext from "../context/main";
import { useNavigate } from "react-router";



interface AllUserType {
  id: string;
  profilePictureUrl: string;
  name: string;
  match:boolean
}

function OneToOneCompeteSpinner() {
  const userDetails = useSelector((state: RootStateType) => state.userDetail);
  const [opponentDetail, setOpponentDetail] = useState<AllUserType | null>(null);
  const [ws, setWs] = useState<WebSocket | null>(null);
  useEffect(() => {console.log(opponentDetail);}, [opponentDetail])
  useEffect(() => {console.log(ws);}, [ws])
  const context = useContext(MainContext)
  const {SERVER_URL,WEBSOCKET_URL} = context

  const navigate = useNavigate()
  useEffect(() => {
    const socket = new WebSocket(WEBSOCKET_URL); // Replace with your WebSocket server URL
    setWs(socket);

    socket.onopen = () => {
      console.log("Connected to WebSocket server");
      socket.send(JSON.stringify({ type: "register", userId: userDetails.id }));
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("Received message:", data);

      if (data.type === "matched") {
        console.log("Matched with an opponent!");
        console.log("id - -",data.opponentId);
        setMatchFound({match:true,id:data.opponentId})
        navigate(`/codeonetoone`)

        // setOpponentDetail({ id: data.opponentId, profilePictureUrl: img, name: "Opponent" ,match:true});
      }

      if (data.type === "message") {
        console.log("Opponent message:", data.message);
      }

      if (data.type === "waiting") {
        console.log(data.message);
      }

      if (data.type === "error") {
        console.error("WebSocket error:", data.message);
      }
    };

    socket.onerror = (error) => {
      console.error("WebSocket encountered an error:", error);
    };

    socket.onclose = () => {
      console.log("WebSocket connection closed.");
    };

    return () => {
      socket.close();
    };
  }, []);
  const [allUsers, setAllUsers] = useState<AllUserType[]>([]);
  const loadAllUser = async()=>{
    console.log("111-1-1");
    
    const result = await fetch(`${SERVER_URL}/api/user/getalluser`,{
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name:1,profilePictureUrl:1 }),      
    })
    const jsondata = await result.json();
    console.log("111-1-1",jsondata);
    if(jsondata.success){
      setAllUsers(jsondata.result)
      
    }
  }
  
  
  const [MatchFound, setMatchFound] = useState<{match:boolean,id:string}>({match:false,id:""})
  useEffect(() => {
    console.log("-d-d-d-d-d-d-d-dd-",MatchFound);
    }, [MatchFound])
  useEffect(() => {}, [opponentDetail])
  
  useEffect(() => {
    // Initializing all users
   
loadAllUser()

  }, []);

  useEffect(() => {
    let isMounted = true; // To prevent updates if component unmounts
  
    const cycleOpponents = async () => {
      let i = 0;
      while (isMounted) {
        if (allUsers.length > 0) {
          console.log(MatchFound.match);
          
          if(MatchFound.match) {
            isMounted=false
            return
          }
          setOpponentDetail({...allUsers[i],match:false});
          i = (i + 1) % allUsers.length; // Loop back to start after last element
        }
        await new Promise(resolve => setTimeout(resolve, 500)); 
      }
    };
  
    if (allUsers.length > 0) {
      cycleOpponents();
    }
  
    return () => {
      isMounted = false; // Stop loop when component unmounts
    };
  }, [allUsers]);
  

  return (
    <div className="d-flex flex-row justify-content-center align-items-center bg-black text-white vh-100">
      {/* User 1 */}
      <div className="d-flex flex-column align-items-center me-5">
        <img
          src={userDetails.profilePictureUrl || img}
          alt="User 1"
          style={{ height: "100px", width: "100px", border: "1px solid white", backgroundColor: "white" }}
        />
        <p className="mt-2">
          {userDetails.name.length > 7 ? userDetails.name.substring(0, 7) + "..." : userDetails.name}
        </p>
      </div>

      <h3 className="fw-bold">V/S</h3>

       {/* Opponent */}
       <div className="d-flex flex-column align-items-center ms-5">
        <img
          src={opponentDetail?.profilePictureUrl || img}
          alt="User 2"
          style={{ height: "100px", width: "100px", border: "1px solid white", backgroundColor: "white" }}
        />
        <p className="mt-2">
          {opponentDetail?.name
            ? opponentDetail.name.length > 7
              ? opponentDetail.name.substring(0, 7) + "..."
              : opponentDetail.name
            : "Random"}
        </p>
      </div>
    </div>
  );
}

export default OneToOneCompeteSpinner;



     
