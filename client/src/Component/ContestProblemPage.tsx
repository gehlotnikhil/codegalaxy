import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import MainContext from "../context/main";

function ContestProblemPage() {
  const param = useParams<{ contestId: string }>();
  const context = useContext(MainContext);
  const navigate = useNavigate();
  const { SERVER_URL } = context;

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

  const [problems, setProblems] = useState<ProblemType[]>([]);
  const [contestName, setContestName] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);
  const [hoveredProblem, setHoveredProblem] = useState<string | null>(null);
  const [leaderboard, setLeaderboard] = useState<{ name: string; score: number }[]>([]);

  const loadAllQuestions = async (id: string) => {
    try {
      const res1 = await fetch(`${SERVER_URL}/api/contest/getcontestproblemfromcontestid/${id}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      const jsondata = await res1.json();
      if (jsondata.success) {
        setProblems(jsondata.result);
        setContestName(jsondata.result[0]?.contestName || "Contest");
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
      console.log("id - - ",id);
      
      // const res = await fetch(`${SERVER_URL}/api/contest/leaderboard/${id}`);
      // const data = await res.json();
      // if (data.success) {
        // setLeaderboard(data.leaderboard);

        setLeaderboard(()=>[{name:"Nikhil",score:300},{name:"Alfaz",score:500},{name:"Maria",score:100}].sort((a,b)=>b.score-a.score));
      // } else {
        // setError(true);
      // }
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
            <div style={styles.header}>{contestName}</div>
            <div style={styles.problemList}>
              {problems.length > 0 ? (
                problems.map((problem, index) => (
                  <div
                    key={problem.id}
                    style={styles.problemCard(hoveredProblem === problem.id)}
                    onMouseEnter={() => setHoveredProblem(problem.id)}
                    onMouseLeave={() => setHoveredProblem(null)}
                    onClick={() => navigate(`/contest/main/${problem.id}`)}
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
            {leaderboard.length > 0 ? (
              leaderboard.map((entry, index) => (
                <div key={index} style={styles.leaderboardItem}>
                  <span>{index + 1}. {entry.name}</span>
                  <span>{entry.score} pts</span>
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
  // Styles
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
    },
    problemList: {
      marginTop: "20px",
      display: "flex",
      flexDirection: "column" as "column",
      gap: "15px",
    },
    problemCard: (isHovered: boolean) => ({
      background: isHovered ? "#007bff" : "#2b2b2b",
      color: isHovered ? "#fff" : "#ccc",
      padding: "20px",
      borderRadius: "8px",
      boxShadow: "0 4px 8px rgba(255, 255, 255, 0.1)",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      transition: "all 0.3s ease-in-out",
      cursor: "pointer",
    }),
    tag: {
      background: "#777",
      color: "#fff",
      padding: "5px 10px",
      borderRadius: "5px",
      fontSize: "12px",
      fontWeight: "bold",
    },
    btn: {
      background: "#28a745",
      color: "#fff",
      padding: "8px 15px",
      borderRadius: "5px",
      textDecoration: "none",
      fontWeight: "bold",
      transition: "background 0.3s ease",
    },
    leaderboard: {
      marginTop: "10px",
      background: "#3a3a3a",
      padding: "10px",
      borderRadius: "8px",
    },
    leaderboardItem: {
      background: "#444",
      padding: "10px",
      marginBottom: "5px",
      borderRadius: "5px",
      display: "flex",
      justifyContent: "space-between",
    },
  };

export default ContestProblemPage;
