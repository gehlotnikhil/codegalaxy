import React, { useEffect, useState } from "react";
import { FaCode } from "react-icons/fa";
import { BsFillGridFill } from "react-icons/bs";
import { GiConvergenceTarget } from "react-icons/gi";
import { AiOutlineRobot } from "react-icons/ai";
import { useLocation, useSearchParams } from "react-router";
import { Link } from "react-router-dom";

const Problem: React.FC = () => {
  const locationHook = useLocation()

  type Question = {
    id?: string;
    problemNo?: number;
    problemName?: string;
    accepted?: number;
    submission?: number;
    status?: "SOLVED" | "UNSOLVED";
    category?: "AI" | "ALGORITHMS" | "CONCURRENCY";
    topic?: (
      | "ARRAY"
      | "STRING"
      | "BINARYSEARCH"
      | "DYNAMICPROGRAMMING"
      | "GRAPH"
    )[];
  };

  // interface InOutType {
  //   input: string;
  //   output: string;
  // }
  // interface TemplateType {
  //   c: string;
  //   cpp: string;
  //   java: string;
  //   go: string;
  // }
  const [searchParams, setSearchParams] = useSearchParams();
  const [page, setPage] = useState<number>(parseInt(searchParams.get("page") || "1")); // State to track the current page

  const filters = [
    { label: "All Topics", icon: <BsFillGridFill />, active: true },
    { label: "Algorithms", icon: <FaCode />, active: false },
    {
      label: "Artificial Intelligence",
      icon: <AiOutlineRobot />,
      active: false,
    },
    { label: "Concurrency", icon: <GiConvergenceTarget />, active: false },
  ];
  const [Questions, setQuestions] = useState<Question[]>([]);

  const loadQuestionDetails = async (pageno?:number) => {
    const page = pageno || 1;
    
    const response = await fetch(
      `http://localhost:8000/api/problemset/getproblemdetails/${page}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const data = await response.json();
    console.log("------", data.result);
    if(data.success && Object.keys(data.result).length === 0){
      console.log("No data found");
      if(data.entireProblemCount !== 0){
      let p = Math.ceil(data.entireProblemCount/10)
      setPage(p);
      setSearchParams({ page: p.toString() });
      }
      
      return;

    }
    if (data.success) {
     setQuestions(data.result);
    }
  };
 
  const handlePrevious = () => {
    if (page > 1) {
      setPage(page - 1);   
      const pageParam = String(Number(searchParams.get("page"))-1);
      setSearchParams({ page: pageParam ? pageParam : "1" });    }
  };

  // Handle the "Next" button click
  const handleNext = () => {
    setPage(page + 1);
    const pageParam = String(Number(searchParams.get("page")) + 1);
    setSearchParams({ page: pageParam ? pageParam : "1" });
  };

useEffect(() => {
  setSearchParams({ page: page.toString() });
  
}, [])

  useEffect(() => {
    loadQuestionDetails(searchParams.get("page") ? Number(searchParams.get("page")) : 1);
    
  }, [locationHook]);

  useEffect(() => {
    console.log(Questions);
  }, [Questions]);

  useEffect(() => {
    console.log("page- ",page,"----","searchParams-",searchParams.get("page"));
    
  }, [page])
  useEffect(() => {
  }, [searchParams.get("page")])
  
  

  return (
    <>
    <div style={styles.container}>
      {/* Filter Section */}
      <div style={styles2.filterContainer}>
        {filters.map((filter) => (
          <button
            key={filter.label}
            style={styles2.filterButton(filter.active)}
          >
            {filter.icon}
            {filter.label}
          </button>
        ))}
      </div>

      {/* Additional Controls */}
      <div style={styles.controls}>
        <select style={styles.dropdown}>
          <option>Difficulty</option>
          <option>Easy</option>
          <option>Medium</option>
          <option>Hard</option>
        </select>
        <select style={styles.dropdown}>
          <option>Status</option>
          <option>Solved</option>
          <option>Unsolved</option>
        </select>
        <select style={styles.dropdown}>
          <option>Tags</option>
          <option>Array</option>
          <option>String</option>
          <option>Dynamic Programming</option>
        </select>
        <input
          type="text"
          placeholder="Search questions"
          style={styles.searchBar}
        />
      </div>

      {/* Table */}
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Status</th>
            <th style={styles.th}>Title</th>
            <th style={styles.th}>Acceptance</th>
            <th style={styles.th}>Difficulty</th>
          </tr>
        </thead>
        <tbody>
          {Questions.map((q, index) => (
            <tr
              key={q.id}
              style={{
                ...styles.row,
                backgroundColor: index % 2 === 0 ? "#1e1e1e" : "#121212",
              }}
            >
              <td style={styles.td}>
                {q.status === "SOLVED" ? (
                  <span role="img" aria-label="done">
                    ✅
                  </span>
                ) : (
                  <span role="img" aria-label="not-done">
                    📅
                  </span>
                )}
              </td>
              <td className="" style={styles.td}><Link className="problem-highlight" to={`/problem/${q.id}`}>{`${q.problemNo}. ${q.problemName}`}</Link></td>

              <td style={styles.td}>{q.submission && q.accepted?((q.accepted/q.submission)*100).toFixed(2):0}%</td>
              <td
                style={{
                  ...styles.td,
                  color:
                    q.submission &&
                    q.accepted &&
                    Number((q.submission / q.accepted) * 100) >= 75
                      ? "#90ee90"
                      : q.submission &&
                        q.accepted &&
                        Number((q.submission / q.accepted) * 100) >= 50
                      ? "#ffa500"
                      : "#ff4500",
                }}
              >
                {q.submission &&
                q.accepted &&
                (q.submission / q.accepted) * 100 >= 75
                  ? "EASY"
                  : q.submission &&
                    q.accepted &&
                    (q.submission / q.accepted) * 100 >= 50
                  ? "MEDIUM"
                  : "HARD"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{ textAlign: "center", margin: "20px" }}>
      <div>
        <button 
          onClick={() => handlePrevious()} 
          disabled={page === 1} // Disable the "Previous" button on the first page
          style={{ marginRight: "10px", padding: "10px 20px" }}
        >
          Previous
        </button>
        <button 
          onClick={() => handleNext()} 
          style={{ padding: "10px 20px" }}
        >
          Next
        </button>
      </div>
    </div>
    </div>


    </>
  );
};

const styles = {
  container: {
    padding: "20px",
    backgroundColor: "#121212",
    color: "#ffffff",
    fontFamily: "Arial, sans-serif",
  },
  filters: {
    display: "flex",
    gap: "10px",
    marginBottom: "20px",
  },
  filterButton: {
    backgroundColor: "#1e1e1e",
    color: "#ffffff",
    padding: "8px 12px",
    border: "1px solid #444",
    borderRadius: "5px",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
  },
  controls: {
    display: "flex",
    gap: "10px",
    marginBottom: "20px",
  },
  dropdown: {
    padding: "8px",
    borderRadius: "5px",
    border: "1px solid #444",
    backgroundColor: "#1e1e1e",
    color: "#ffffff",
  },
  searchBar: {
    flex: 1,
    padding: "8px",
    borderRadius: "5px",
    border: "1px solid #444",
    backgroundColor: "#1e1e1e",
    color: "#ffffff",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse" as const,
  },
  th: {
    padding: "10px",
    textAlign: "left" as const,
    borderBottom: "1px solid #444",
    backgroundColor: "#1e1e1e",
  },
  td: {
    padding: "10px",
    textAlign: "left" as const,
    borderBottom: "1px solid #333",
  },
  row: {
    transition: "background-color 0.3s ease",
  },
};

const styles2 = {
  filterContainer: {
    display: "flex",
    gap: "10px",
    padding: "10px 0",
  },
  filterButton: (isActive: boolean) => ({
    display: "flex",
    alignItems: "center",
    gap: "8px",
    backgroundColor: isActive ? "#ffffff" : "#1e1e1e",
    color: isActive ? "#000" : "#ffffff",
    padding: "8px 16px",
    borderRadius: "20px",
    cursor: "pointer",
    border: "none",
    fontWeight: "bold",
    boxShadow: isActive ? "0px 0px 5px rgba(255, 255, 255, 0.8)" : "none",
  }),
};

export default Problem;
