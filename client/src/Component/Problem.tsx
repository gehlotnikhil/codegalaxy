import React from "react";
import { FaCode } from "react-icons/fa";
import { BsFillGridFill } from "react-icons/bs";
import { GiConvergenceTarget } from "react-icons/gi";
import { AiOutlineRobot } from "react-icons/ai";  
const filters = [
  { label: "All Topics", icon: <BsFillGridFill />, active: true },
  { label: "Algorithms", icon: <FaCode />, active: false },
  { label: "Artificial Intelligence", icon: <AiOutlineRobot />, active: false },
  { label: "Concurrency", icon: <GiConvergenceTarget />, active: false },
];

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
type Question = {
  id: number;
  title: string;
  solution: boolean;
  acceptance: string;
  difficulty: string;
  status: boolean;
};

const questions: Question[] = [
  {
    id: 1400,
    title: "Construct K Palindrome Strings",
    solution: true,
    acceptance: "67.8%",
    difficulty: "Medium",
    status: true,
  },
  {
    id: 1,
    title: "Two Sum",
    solution: true,
    acceptance: "54.6%",
    difficulty: "Easy",
    status: true,
  },
  {
    id: 2,
    title: "Add Two Numbers",
    solution: true,
    acceptance: "45.0%",
    difficulty: "Medium",
    status: true,
  },
  {
    id: 3,
    title: "Longest Substring Without Repeating Characters",
    solution: true,
    acceptance: "36.0%",
    difficulty: "Medium",
    status: true,
  },
  {
    id: 4,
    title: "Median of Two Sorted Arrays",
    solution: false,
    acceptance: "42.4%",
    difficulty: "Hard",
    status: false,
  },
  {
    id: 5,
    title: "Longest Palindromic Substring",
    solution: false,
    acceptance: "35.0%",
    difficulty: "Medium",
    status: false,
  },
  {
    id: 6,
    title: "Zigzag Conversion",
    solution: false,
    acceptance: "50.3%",
    difficulty: "Medium",
    status: false,
  },
  {
    id: 7,
    title: "Reverse Integer",
    solution: true,
    acceptance: "29.6%",
    difficulty: "Medium",
    status: true,
  },
  {
    id: 8,
    title: "String to Integer (atoi)",
    solution: false,
    acceptance: "18.4%",
    difficulty: "Medium",
    status: false,
  },
  {
    id: 9,
    title: "Palindrome Number",
    solution: false,
    acceptance: "58.3%",
    difficulty: "Easy",
    status: false,
  },
];

const Problem: React.FC = () => {
  return (
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
          {questions.map((q, index) => (
            <tr
              key={q.id}
              style={{
                ...styles.row,
                backgroundColor: index % 2 === 0 ? "#1e1e1e" : "#121212",
              }}
            >
              <td style={styles.td}>
                {q.status ? (
                  <span role="img" aria-label="done">
                    ✅
                  </span>
                ) : (
                  <span role="img" aria-label="not-done">
                    📅
                  </span>
                )}
              </td>
              <td style={styles.td}>{`${q.id}. ${q.title}`}</td>
              
              <td style={styles.td}>{q.acceptance}</td>
              <td
                style={{
                  ...styles.td,
                  color:
                    q.difficulty === "Easy"
                      ? "#90ee90"
                      : q.difficulty === "Medium"
                      ? "#ffa500"
                      : "#ff4500",
                }}
              >
                {q.difficulty}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
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

export default Problem;
