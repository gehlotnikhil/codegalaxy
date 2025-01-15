import React, { useContext, useEffect, useMemo, useState } from "react";
import { FaCode } from "react-icons/fa";
import { BsFillGridFill } from "react-icons/bs";
import { GiConvergenceTarget } from "react-icons/gi";
import { AiOutlineRobot } from "react-icons/ai";
import { useLocation, useSearchParams } from "react-router";
import { Link } from "react-router-dom";
import MainContext from "../context/main";

const Problem: React.FC = () => {
  const context = useContext(MainContext);
  const {ServerUrl} = context;
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
  interface FilterType {
    category:
      | "All Topics"
      | "Algorithms"
      | "Artificial Intelligence"
      | "Concurrency";
    status: "Status" | "UNSOLVED" | "SOLVED";
    tags:
      | "Tags"
      | "ARRAY"
      | "STRING"
      | "BINARYSEARCH"
      | "DYNAMICPROGRAMMING"
      | "GRAPH";
    searchQuestion: string;
    difficulty: "Difficulty" | "Easy" | "Medium" | "Hard";
  }

  const tags = [
    "ARRAY",
    "STRING",
    "BINARYSEARCH",
    "DYNAMICPROGRAMMING",
    "GRAPH",
  ];
  const locationHook = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [page, setPage] = useState<number>(
    parseInt(searchParams.get("page") || "1")
  ); // State to track the current page
  const [Questions, setQuestions] = useState<Question[]>([]);

  const [Filter, setFilter] = useState<FilterType>({
    tags: "Tags",
    status: "Status",
    searchQuestion: "",
    difficulty: "Difficulty",
    category: "All Topics",
  });

  useEffect(() => {
    setSearchParams({ page: page.toString() });
  }, []);

  useEffect(() => {
    loadQuestionDetails(
      searchParams.get("page") ? Number(searchParams.get("page")) : 1
    );
  }, [locationHook]);

  useEffect(() => {
    console.log(Questions);
  }, [Questions]);

  useEffect(() => {
    console.log(
      "page- ",
      page,
      "----",
      "searchParams-",
      searchParams.get("page")
    );
  }, [page]);
  useEffect(() => {}, [searchParams.get("page")]);

  const filteredQuestions = useMemo(() => {
    let filtered = Questions;
    if(Filter.difficulty !== "Difficulty"){
      filtered = filtered.filter((q)=>{
        let per = q.accepted && q.submission && (q.accepted/q.submission*100) || 0
        if(Filter.difficulty === "Easy"){
          return per<=100 && per>=75
        }else if(Filter.difficulty === "Medium"){
          return per>=50 && per<75
        }else if(Filter.difficulty === "Hard"){
          return per<50 && per>=0
        }
      })
    }
    if (Filter.category !== "All Topics") {
      const categoryMap: { [key: string]: string } = {
        "All Topics": "",
        Algorithms: "ALGORITHMS",
        "Artificial Intelligence": "AI",
        Concurrency: "CONCURRENCY",
      };
      filtered = filtered.filter(
        (q) => q.category === categoryMap[Filter.category]
      );
    }
    if (Filter.status !== "Status") {
      filtered = filtered.filter((q) => {
        console.log(q.status,"-------checking----", Filter.status);
       return q.status === Filter.status;
      });
      console.log("-------hello----", filtered);
    }
    if (Filter.tags !== "Tags") {
      filtered = filtered.filter((q) =>
        q.topic?.includes(
          Filter.tags as
            | "ARRAY"
            | "STRING"
            | "BINARYSEARCH"
            | "DYNAMICPROGRAMMING"
            | "GRAPH"
        )
      );
    }
    if (Filter.searchQuestion.trim() !== "") {
      filtered = filtered.filter((q) =>
        q.problemName
          ?.toLowerCase()
          .includes(Filter.searchQuestion.toLowerCase())
      );
    }
    return filtered;
  }, [Questions, Filter]);

  useEffect(() => {
    console.log(filteredQuestions);
  }, [filteredQuestions]);

  const loadQuestionDetails = async (pageno?: number) => {
    const page = pageno || 1;

    const response = await fetch(
      `${ServerUrl}/api/problemset/getproblemdetails/${page || 1}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const data = await response.json();
    console.log("------", data.result);
    if (data.success && Object.keys(data.result).length === 0) {
      console.log("No data found");
      if (data.entireProblemCount !== 0) {
        let p = Math.ceil(data.entireProblemCount / 10);
        setPage(p);
        setSearchParams({ page: p.toString() });
      }

      return;
    }
    if (data.success) {
      setQuestions(data.result);
    }
  };

  const handleFilterChange = (name: any, value: any) => {
    setFilter({ ...Filter, [name]: value });
  };

  const handlePrevious = () => {
    if (page > 1) {
      setPage(page - 1);
      const pageParam = String(Number(searchParams.get("page")) - 1);
      setSearchParams({ page: pageParam ? pageParam : "1" });
    }
  };

  // Handle the "Next" button click
  const handleNext = () => {
    setPage(page + 1);
    const pageParam = String(Number(searchParams.get("page")) + 1);
    setSearchParams({ page: pageParam ? pageParam : "1" });
  };

  return (
    <>
      <div style={styles.container}>
        {/* Filter Section */}
        <div style={styles2.filterContainer}>
          {[
            { label: "All Topics", icon: <BsFillGridFill /> },
            { label: "Algorithms", icon: <FaCode /> },
            { label: "Artificial Intelligence", icon: <AiOutlineRobot /> },
            { label: "Concurrency", icon: <GiConvergenceTarget /> },
          ].map((filter) => (
            <button
              key={filter.label}
              onClick={() => handleFilterChange("category", filter.label)}
              style={styles2.filterButton(Filter.category === filter.label)}
            >
              {filter.icon} {filter.label}
            </button>
          ))}
        </div>

        {/* Additional Controls */}
        <div style={styles.controls}>
          <select
            style={styles.dropdown}
            onChange={(e) => handleFilterChange("difficulty", e.target.value)}
          >
            <option>Difficulty</option>
            <option>Easy</option>
            <option>Medium</option>
            <option>Hard</option>
          </select>
          <select
            style={styles.dropdown}
            onChange={(e) => handleFilterChange("status", e.target.value)}
          >
            <option>Status</option>
            <option value={"SOLVED"}>Solved</option>
            <option value={"UNSOLVED"}>Unsolved</option>
          </select>
          <select
            style={styles.dropdown}
            onChange={(e) => handleFilterChange("tags", e.target.value)}
          >
            <option>Tags</option>
            {tags.map((tag) => (
              <option value={tag} key={tag}>
                {tag}
              </option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Search questions"
            style={styles.searchBar}
            onChange={(e) =>
              handleFilterChange("searchQuestion", e.target.value)
            }
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
            {filteredQuestions.map((q, index) => (
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
                <td className="" style={styles.td}>
                  <Link
                    className="problem-highlight"
                    to={`/problem/${q.id}`}
                  >{`${q.problemNo}. ${q.problemName}`}</Link>
                </td>

                <td style={styles.td}>
                  {q.submission && q.accepted
                    ? ((q.accepted / q.submission) * 100).toFixed(2)
                    : 0}
                  %
                </td>
                <td
                  style={{
                    ...styles.td,
                    color:
                      q.submission &&
                      q.accepted &&
                      Number((q.accepted / q.submission) * 100) >= 75
                        ? "#90ee90"
                        : q.submission &&
                          q.accepted &&
                          Number((q.accepted / q.submission) * 100) >= 50
                        ? "#ffa500"
                        : "#ff4500",
                  }}
                >
                  {q.submission &&
                  q.accepted &&
                  (q.accepted / q.submission) * 100 >= 75
                    ? "EASY"
                    : q.submission &&
                      q.accepted &&
                      (q.accepted / q.submission) * 100 >= 50
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
