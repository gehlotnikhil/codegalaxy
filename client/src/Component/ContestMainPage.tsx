import React, { useContext, useEffect, useState } from "react";
import { Card, Button, Container, Row, Col } from "react-bootstrap";
import MainContext from "../context/main";
import { useNavigate } from "react-router";
import { apiFetch } from '../utils/api';


interface ContestType{
  id               :string
  contestNo        :number      
  contestName      :string
  duration         :number
  startTime        :string
  problems         :string[]
}


const ContestCard: React.FC<{ contest: ContestType }> = ({ contest }) => {
  const naivgate = useNavigate()
  const [isActive, setisActive] = useState<"ACTIVE" | "UPCOMMING" | "ENDED">("ACTIVE")
  useEffect(() => {
    setisActive(()=>{
      let a:any = (new Date().getTime()-new Date(contest.startTime).getTime())
      console.log(":::",new Date().toLocaleString()," ",new Date(contest.startTime).toLocaleString(),"  ",new Date((new Date(contest.startTime)).getTime() + (contest.duration) * 60 * 1000).toLocaleString());
      
      console.log("a-a-a--",a);
      console.log("d--",(Number(contest.duration)  * 60 * 1000));
      console.log("end----",(a-(Number(contest.duration) * 60 * 1000)));
      
    if(a<0) return "UPCOMMING"
    else{
      if(new Date().getTime()-  (new Date((new Date(contest.startTime)).getTime() + (contest.duration) * 60 * 1000).getTime())  <0){
        return "ACTIVE"
      }else return "ENDED"
    }
    })
  }, [])
  
  useEffect(() => {
    console.log(isActive);
    
  }, [isActive])
  
  if(contest ===null) return <></>
  return (
    <Card className="p-3 mb-3 bg-secondary text-light shadow-lg rounded" style={{ borderLeft: isActive === "ACTIVE" ?"5px solid  #28a745" :isActive==="UPCOMMING"?"5px solid rgb(193, 210, 37)" : "5px solid  #dc3545" }} >
      <Card.Body>
        <Card.Title className="fw-bold">{contest.contestNo}. {contest.contestName}</Card.Title>
        <Card.Text>
          {!(isActive==="ENDED") &&(<small className="d-block">🕒 Started: {(new Date(contest.startTime)).toLocaleString()}</small>)}
          <small className="d-block">⏳ Duration: {contest.duration}</small>
          <span style={{ color:isActive === "ACTIVE" ?" #28a745" :isActive==="UPCOMMING"?"rgb(193, 210, 37)" : " #dc3545", fontWeight: "bold" }}>
            {isActive}
          </span>
        </Card.Text>
        <Button variant="light" onClick={()=>{
          naivgate(`/contest/${contest.id}`)
        }} className={`fw-bold d-${isActive==="UPCOMMING"?"none":"block"}`}>Participate</Button>
      </Card.Body>
    </Card>
  );
};

const ContestMainPage: React.FC = () => {
  const context = useContext(MainContext)
  let {SERVER_URL} = context
  
  const loadContest = async()=>{
    try {
      
    
      const result1 = await apiFetch(`/api/contest/getallcontest`,{
        method:"POST",
        headers: {
          "Content-Type": "application/json",
        }
      });
      const jsondata = await result1
      if(jsondata.success){
        console.log("Contest - - - ",jsondata);
        sessionStorage.setItem("hi",JSON.stringify(jsondata.result))
        setAllContest([...jsondata.result])
      }
      else{
        console.log("Not found")
      }
    } catch (error) {
      console.log("Internal server error - ",error);
    }
  }
  useEffect(() => {
    console.log("-----------------------");
    loadContest()
    console.log("-----------------------");
    
  }, [])
  

const [AllContest, setAllContest] = useState<ContestType[] | null>(null)




  return (
    <Container fluid className="bg-dark text-light min-vh-100 py-5">
      <Container>
        <h2 className="text-white mb-3" style={{textDecoration:"underline"}}> Contests</h2>
        <p className="text-muted">Check out the upcoming programming contests on CodeGalaxy.</p>
        <Row className="g-4">
          {(AllContest||[]).map(contest => {
              if(new Date().getTime()-  (new Date((new Date(contest.startTime)).getTime() + (contest.duration) * 60 * 1000).getTime())  >0){
                return;
                }
            return (
            <Col md={6} key={contest.id || 1}>
              <ContestCard contest={contest || null} />
            </Col>
          )})}
        </Row>

        <h2 className="text-white mt-5" style={{textDecoration:"underline"}}> Virtual Contests</h2>
        <p className="text-muted">Check out the previous programming contests on CodeGalaxy.</p>
        <Row className="g-4">
        {(AllContest||[]).map(contest => {
                if(new Date().getTime()-(new Date((new Date(contest.startTime)).getTime() + (contest.duration) * 60 * 1000).getTime())  <0){
                return;
                }
          return(  <Col md={6} key={contest.id}>
              <ContestCard contest={contest} />
            </Col>)
})}
        </Row>
      </Container>
    </Container>
  );
};

export default ContestMainPage;
