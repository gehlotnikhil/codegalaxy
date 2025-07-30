import React, { useEffect, useState } from "react";
import img from "../assets/compete.jfif";
import { Row, Col, Form, Button, Card, Table } from "react-bootstrap";
import { useNavigate } from "react-router";
import { useSelector } from "react-redux";
import { RootStateType } from "../store";
import { apiFetch } from '../utils/api';

const ContestPage: React.FC = () => {
  const navigate = useNavigate();
  const [BtnJoin, setBtnJoin] = useState(false);
  const [ActiveBattle, setActiveBattle] = useState<LeaderBoardType | null>(
    null
  );

  const userDetail = useSelector((state: RootStateType) => state.userDetail);
  interface OpponentType {
    id: string;
    name: string;
  }

  interface LeaderBoardType {
    id: string;
    Result: "WON" | "LOSE" | "TIE";
    createdAt: string;
    duration: number;
    problemId: string;
    status: "ACTIVE" | "INACTIVE";
    user: OpponentType;
  }
  const [LeaderBoard, setLeaderBoard] = useState<LeaderBoardType[] | null>(
    null
  );
  useEffect(() => {
    console.log(LeaderBoard);
  }, [LeaderBoard]);
  useEffect(() => {
    console.log("BtnJoin-", BtnJoin);
  }, [BtnJoin]);
  useEffect(() => {
    console.log("ActiveBattle-", ActiveBattle);
  }, [ActiveBattle]);

  const loadUserBattleDetail = async () => {
    try {
      const result1 = await apiFetch(
        `/api/onetoonecompete/getonetoonecompeteleaderboard/${userDetail.id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const jsondata = await result1;
      if (jsondata.success) {
        setLeaderBoard(jsondata.result);
        setBtnJoin(() => {
          let status = true;
          status = jsondata.result.some((e: any) => {
            if (e.status === "ACTIVE") {
              setActiveBattle(e);
              return true;
            } else {
              return false;
            }
          });

          return status;
        });
      } else {
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    loadUserBattleDetail();
  }, []);

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
                <Card.Header>Compete With World</Card.Header>
                <Card.Body>
                  <Form>
                    <Button
                      className="custom-btn mt-3"
                      onClick={() => {
                        navigate("/findopponent");
                      }}
                      disabled={BtnJoin}
                    >
                      Join
                    </Button>
                  </Form>
                </Card.Body>
              </Card>
              {ActiveBattle && (
                <Card className="mt-3 active-battle-card">
                  <Card.Header className="text-center bg-warning text-dark">
                    Ongoing Battle ⚔️
                  </Card.Header>
                  <Card.Body>
                    <h5 className="text-center">
                      <strong>
                        {userDetail.name} VS {ActiveBattle.user.name}
                      </strong>
                    </h5>
                    <p className="text-center text-muted">
                      Match Status:{" "}
                      <span className="text-success">Active 🟢</span>
                    </p>
                    <p className="text-center">
                      Duration: <strong>{ActiveBattle.duration} mins</strong>
                    </p>
                    <p className="text-center">
                      Started At:{" "}
                      <strong>
                        {new Date(ActiveBattle.createdAt).toLocaleString()}
                      </strong>
                    </p>
                    <Button
                      className="custom-btn-2 mt-3"
                      onClick={() => {
                        navigate(`/codeonetoone/${ActiveBattle.id}`);
                      }}
                    >
                      Join
                    </Button>
                  </Card.Body>
                </Card>
              )}
            </Col>
          </Row>
        </div>
      </div>

      <h3 className="mt-4">Leaderboard</h3>
      <Table
        responsive
        striped
        bordered
        hover
        variant="dark"
        className="mt-3 custom-table"
      >
        <thead>
          <tr>
            <th>#</th>
            <th>Match</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {LeaderBoard ? (
            LeaderBoard.map((e, index) => {
              if (e.status === "ACTIVE") {
                return <tr key={index}></tr>;
              }
              return (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>
                    <strong>
                      {userDetail.name} VS {e.user.name}
                    </strong>
                  </td>
                  <td className={`${e.status.toLowerCase()}`}>
                    {e.Result}{" "}
                    {e.Result === "WON"
                      ? "✅"
                      : e.Result === "LOSE"
                      ? "❌"
                      : "➖"}
                  </td>
                </tr>
              );
            })
          ) : (
            <></>
          )}
        </tbody>
      </Table>

      {/* Custom Styling */}
      <style>
        {`
   .active-battle-card {
      border: 2px solid #ffc107;
      box-shadow: 0px 4px 10px rgba(255, 193, 7, 0.4);
      border-radius: 12px;
    }

    .active-battle-card h5 {
      font-size: 1.2rem;
      font-weight: bold;
    }

    .active-battle-card p {
      font-size: 1rem;
    }

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
          .custom-btn-2 {
            width: 100%;
            padding: 12px;
            font-size: 1.1rem; 
            font-weight: bold;
  background: linear-gradient(45deg, #1e90ff, #6a0dad);
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
