import React, { useContext, useEffect, useState } from "react";
import img from "../assets/compete.jfif";
import { Row, Col, Form, Button, Card, Table } from "react-bootstrap";
import { useSelector } from "react-redux";
import { RootStateType } from "../store";
import MainContext from "../context/main";

const ContestPage: React.FC = () => {
  const [opponent, setOpponent] = useState("");
  const [CompeteWithWorld, setCompeteWithWorld] = useState(false)
  const context = useContext(MainContext)
  const {SERVER_URL} = context
  useEffect(() => {console.log(CompeteWithWorld);}, [CompeteWithWorld])
  const userDetail = useSelector((state:RootStateType)=>state.userDetail)
  const [checkIsThereAnyBattleLeft,setCheckIsThereAnyBattleLeft] = useState(true)
  const loadUserBattleDetail = async()=>{
    try {
      
  
    const result1 = await fetch(`${SERVER_URL}/api/onetoonecompete/getonetoonecompeteleaderboard/${userDetail.id}`,{
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
    const jsondata = await result1.json()
    if(jsondata.success){

    }else{

    }
  } catch (error) {
      console.log(error);
  }
  }
  useEffect(() => {
    
  }, [])
  
  
  return (
    <div className="container-fluid bg-black text-white p-4">
      <div className="row">
        <div className="col-md-8">
          <img src={img} alt="Codefest 2025" className="img-fluid rounded" />
        </div>
        <div className="col-md-4 d-flex flex-column">
          <Row style={{ margin: "1rem 0 2rem 0" }}>
            <Col>
              <Card>
                <Card.Header>Enter Opponent</Card.Header>
                <Card.Body>
                  <Form>
                    <Form.Group controlId="opponent">
                      <Form.Label>Opponent Username</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter username"
                        value={opponent}
                        onChange={(e) => setOpponent(e.target.value)}
                      />
                    </Form.Group>
                    <Button className="custom-btn mt-3" disabled={!opponent}>
                      Compete with Friend
                    </Button>
                  </Form>
                </Card.Body>
              </Card>
            </Col>
          </Row>
          <Button className="custom-btn mt-2" disabled={checkIsThereAnyBattleLeft}>
            Compete With World
          </Button>
        </div>
      </div>

      {/* Updated Leaderboard */}
      <h3 className="mt-4">Leaderboard</h3>
      <Table responsive striped bordered hover variant="dark" className="mt-3 custom-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Match</th>
            <th>Win/Loss</th>
          </tr>
        </thead>
        <tbody>
        {/* {
          Leaderboard.map((e,index)=>{
            <tr>
            <td>{index}</td>
            <td><strong>{userDetail.name} VS PythonWarrior</strong></td>
            <td className="win">Win ✅</td>
          </tr>
          })
        } */}
          <tr>
            <td>1</td>
            <td><strong>CodeMaster99 VS PythonWarrior</strong></td>
            <td className="win">Win ✅</td>
          </tr>
          <tr>
            <td>2</td>
            <td><strong>DevKing VS ReactNinja</strong></td>
            <td className="loss">Loss ❌</td>
          </tr>
          <tr>
            <td>3</td>
            <td><strong>BugSlayer VS CodeGuru</strong></td>
            <td className="win">Win ✅</td>
          </tr>
        </tbody>
      </Table>

      {/* Custom Styling */}
      <style>
        {`
          .custom-btn {
            width: 100%;
            padding: 12px;
            font-size: 1.1rem;
            font-weight: bold;
            background: linear-gradient(45deg, #ff7e5f, #feb47b);
            border: none;
            color: white;
            border-radius: 8px;
            transition: transform 0.2s, filter 0.2s;
          }
          
          .custom-btn:hover {
            transform: scale(1.05);
            filter: brightness(1.2);
          }

          .custom-btn:disabled {
            background: #555;
            cursor: not-allowed;
          }

          .custom-table th {
            text-align: center;
            background-color: #444;
          }

          .custom-table td {
            text-align: center;
            font-size: 1rem;
          }

          .win {
            color: #00ff00;
            font-weight: bold;
          }

          .loss {
            color: #ff4d4d;
            font-weight: bold;
          }
        `}
      </style>
    </div>
  );
};

export default ContestPage;
