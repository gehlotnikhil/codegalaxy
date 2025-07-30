import {  useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { apiFetch } from '../utils/api';

function ContestProblemPage() {
  const param = useParams<{ contestId: string }>();
  const navigate = useNavigate();

  interface CodeTemplate {
    c: string;
    java: string;
    go: string;
    cpp: string;
  }

  interface ProblemType {
    createdAt: string;
    topic: ("ARRAY" | "STRING" | "BINARYSEARCH" | "DYNAMICPROGRAMMING" | "GRAPH")[];
    constraint: string[];
    description: string;
    problemName: string;
    problemNo: number;
    id: string;
    correctMiddleCode: CodeTemplate;
    middleCode: CodeTemplate;
    belowCodeTemplate: CodeTemplate;
    aboveCodeTemplate: CodeTemplate;
    sampleInputOutput: CodeTemplate;
    testcases: CodeTemplate;
    
  }

  interface ContestType {
    id: string;
    contestno: number;
    contestName: string;
    duration: number;
    startTime: string;
    problems: string[];
  }

  interface ParticipentType{
    name?:string
    userid:string,
    solvedProblem:string[]
  }
  interface LeaderBoardType{
    id:string,
    contestid:string,
    participent:ParticipentType[]
  }
  const [Contest, setContest] = useState<ContestType | null>(null);
  useEffect(() => {console.log(Contest);}, [Contest])
  useEffect(() => {
    console.log(Contest);
    
  }, [Contest])
  
  const [problems, setProblems] = useState<ProblemType[]>([]);
  const [contestName, setContestName] = useState<string>("");
  const [remainingTime, setRemainingTime] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);
  const [hoveredProblem, setHoveredProblem] = useState<string | null>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderBoardType | null>(null);

  const calculateRemainingTime = (startTime: string, duration: number) => {
    const startTimestamp = new Date(startTime).getTime();
    const endTimestamp = startTimestamp + duration * 60 * 1000;

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const diff = endTimestamp - now;

      if (diff <= 0) {
        clearInterval(interval);
        setRemainingTime("00:00:00");
      } else {
        const hours = Math.floor(diff / (1000 * 60 * 60)).toString().padStart(2, "0");
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)).toString().padStart(2, "0");
        const seconds = Math.floor((diff % (1000 * 60)) / 1000).toString().padStart(2, "0");
        setRemainingTime(`${hours}:${minutes}:${seconds}`);
      }
    }, 1000);
  };

  const loadAllQuestions = async (id: string) => {
    try {
      const res1 = await apiFetch(`/api/contest/getcontestproblemfromcontestid/${id}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      const jsondata = await res1;
      if (jsondata.success) {
        setProblems(jsondata.result);
      } else {
        setError(true);
      }

      const res2 = await apiFetch(`/api/contest/getspecificcontest?id=${id}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      const jsondata2 = await res2;
      if (jsondata2.success) {
        setContest(jsondata2.result);
        setContestName(jsondata2.result.contestName || "Contest");
        calculateRemainingTime(jsondata2.result.startTime, jsondata2.result.duration);
      } else {
        setError(true);
      }
    } catch (err) {
      console.error("Error fetching contest problems:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };
  const loadLeaderboard = async (id: string) => {
    try {
      console.log("Fetching leaderboard for contest:", id);
  
      const leaderboardResponse = await apiFetch(`/api/contest/leaderboard/${id}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      
      const leaderboardData = await leaderboardResponse;
      if (!leaderboardData.success) throw new Error("Failed to fetch leaderboard");
  
      const usersResponse = await apiFetch(`/api/user/getalluser`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: 1 }),
      });
  
      const usersData = await usersResponse;
      if (!usersData.success) throw new Error("Failed to fetch users");
  
      const userMap = new Map(usersData.result.map((user: any) => [user.id, user.name]));
      
      const updatedParticipants = leaderboardData.result.participent.map((participant: any) => ({
        ...participant,
        userid: userMap.get(participant.userid) || participant.userid,
      }));
      updatedParticipants.sort((a:any,b:any)=>b.solvedProblem.length-a.solvedProblem.length)
  
      setLeaderboard({ ...leaderboardData.result, participent: updatedParticipants });
    } catch (err) {
      console.error("Error fetching leaderboard:", err);
      setError(true);
    }
  };
  

  useEffect(() => {
    if (param.contestId) {
      loadAllQuestions(param.contestId);
      loadLeaderboard(param.contestId);
    }
  }, [param.contestId]);

  return (
    <div style={styles.container}>
      {loading ? (
        <div className="text-center">
          <div className="spinner-border text-light" role="status"></div>
          <p className="mt-2">Loading problems...</p>
        </div>
      ) : error ? (
        <p className="text-danger text-center">Failed to load data.</p>
      ) : (
        <>
          {/* Left Section: Problems List */}
          <div style={styles.leftSection}>
            <div style={styles.header}>
              {contestName} <span style={styles.timer}>{remainingTime}</span>
            </div>
            <div style={styles.problemList}>
              {problems.length > 0 ? (
                problems.map((problem, index) => (
                  <div
                    key={problem.id}
                    style={styles.problemCard(hoveredProblem === problem.id)}
                    onMouseEnter={() => setHoveredProblem(problem.id)}
                    onMouseLeave={() => setHoveredProblem(null)}
                    onClick={() => navigate(`/contest/${param.contestId}/${problem.id}`)}
                  >
                    <span>
                      <strong>{index + 1}. {problem.problemName}</strong>
                    </span>
                    <span style={styles.tag}>{problem.topic[0]}</span>
                    <p style={styles.btn}>Solve</p>
                  </div>
                ))
              ) : (
                <p className="text-warning">No problems found.</p>
              )}
            </div>
          </div>

          {/* Right Section: Leaderboard */}
          <div style={styles.rightSection}>
            <h3>Leaderboard</h3>
              {leaderboard && leaderboard.participent.length > 0 ? (
                leaderboard.participent.map((p, index) => (
                  <div key={index} style={styles.leaderboardItem}>
                    <span>{p.userid}</span>
                    <span>{p.solvedProblem.length*50}</span>
                  </div>
                ))
              ) : (
                <p className="text-warning">No leaderboard data.</p>
              )}
      
          </div>
        </>
      )}
    </div>
  );
}
const styles = {
  container: {
    display: "flex",
    background: "#1e1e1e",
    color: "#fff",
    minHeight: "100vh",
    padding: "20px",
    fontFamily: "Arial, sans-serif",
  },
  leftSection: {
    flex: 2,
    paddingRight: "20px",
  },
  rightSection: {
    flex: 1,
    background: "#282828",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 4px 8px rgba(255, 255, 255, 0.1)",
  },
  header: {
    background: "#007bff",
    color: "#fff",
    textAlign: "center" as "center",
    padding: "20px",
    fontSize: "24px",
    fontWeight: "bold",
    borderRadius: "8px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  leaderboardItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px",
    background: "#444",
    borderRadius: "5px",
    marginBottom: "5px",
    fontWeight: "bold",
    color: "#fff",
  },
  timer: {
    fontSize: "18px",
    background: "#ff4757",
    padding: "5px 10px",
    borderRadius: "5px",
  },
  problemList: {
    marginTop: "20px",
    display: "flex",
    flexDirection: "column" as "column",
    gap: "10px",
  },
  problemCard: (isHovered: boolean) => ({
    padding: "15px",
    background: isHovered ? "#007bff" : "#333",
    color: isHovered ? "#fff" : "#ccc",
    borderRadius: "5px",
    cursor: "pointer",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  }),
  tag: {
    background: "#ffcc00",
    color: "#000",
    padding: "5px 10px",
    borderRadius: "4px",
    fontSize: "12px",
    fontWeight: "bold",
  },
  btn: {
    background: "#28a745",
    color: "#fff",
    padding: "5px 10px",
    borderRadius: "4px",
    fontWeight: "bold",
    cursor: "pointer",
  },
};
export default ContestProblemPage;
