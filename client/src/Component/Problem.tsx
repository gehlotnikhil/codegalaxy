import React, { useEffect, useState } from "react";
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



type Question = {
  id?: number;
  title?: string;
  submission?: number;
  acceptance?: number;
  status?: "SOLVED"|"UNSOLVED";
};


const Problem: React.FC = () => {
  interface InOutType {
    input: string;
    output: string;
  }
  interface TemplateType {
    c: string;
    cpp: string;
    java: string;
    go: string;
  }
interface CodingQuestionType {
  sampleInputOutput : InOutType[];
  testcases: InOutType[];
  aboveCodeTemplate: TemplateType;
  belowCodeTemplate: TemplateType;
  middleCode: TemplateType;
  id: string;
  problemNo: number;
  problemName: string;
  description: string;
  companies: string[];
  like: number;
  dislike: number;
  constraint: string[];
  topic: string[];
  accepted: number;
  submission: number;
  status: "SOLVED" | "UNSOLVED";
  category: "AI" | "ALGORITHMS" | "CONCURRENCY";
}

const CodingQuestion = [
  {
      "sampleInputOutput": [
        {
          "input": "77 45 7",
          "output": "11"
        },
        {
          "input": "559 56 9",
          "output": "2"
        }
      ],
      "testcases": [
        {
          "input": "23 54 65",
          "output": "12"
        },
        {
          "input": "99 66 6",
          "output": "76"
        }
      ],
      "aboveCodeTemplate": {
        "c": "#include <stdio.h>\n\n",
        "cpp": "#include <iostream>\nusing namespace std;\n\n",
        "java": "import java.util.Scanner;\n\npublic class Main {\n",
        "go": "package main\n\nimport (\n\t\"fmt\"\n)\n\n"
      },
      "belowCodeTemplate": {
        "c": "\nint main() {\n  int a, b;\n  scanf(\"%d\", &a);\n  scanf(\"%d\", &b);\n  printf(\"%d\", addTwoNumber(a, b));\n  return 0;\n}",
        "cpp": "\n    int main() {\n   int a,b;\n   cin>>a;\n   cin>>b;\n   cout<<addTwoNumber(a,b);\n   return 0;\n  }",
        "java": "    \n    public static void main(String[] args) {\n        Scanner scanner = new Scanner(System.in);\n        int a = scanner.nextInt();\n        int b = scanner.nextInt();\n        System.out.println(addTwoNumber(a, b));\n        scanner.close();\n    }\n}\n",
        "go": "\nfunc main() {\n\tvar a, b int\n\tfmt.Scan(&a)\n\tfmt.Scan(&b)\n\tfmt.Println(addTwoNumber(a, b))\n}\n"
      },
      "middleCode": {
        "c": "int addTwoNumber(int a, int b) {\n    // Logic\n}",
        "cpp": "int addTwoNumber(int a,int b){\n   // Logic\n}",
        "java": "public static int addTwoNumber(int a, int b) {\n   // Logic\n}",
        "go": "func addTwoNumber(a int, b int) int {\n\t// Logic\n}"
      },
      "id": "67842034f66d5dec66194c9a",
      "problemNo": 1,
      "problemName": "Random 3",
      "description": "helloWorld",
      "companies": [
        "Apple",
        "Google"
      ],
      "like": 12,
      "dislike": 44,
      "constraint": [
        "t1",
        "t2"
      ],
      "topic": [
        "Array",
        "String"
      ],
      "accepted": 34,
      "submission": 100,
      "status": "UNSOLVED",
      "category": "AI"
    }
  
]

const [Questions, setQuestions] = useState<Question[]>([
  {
   
  
  }
]);
useEffect(() => {
  console.log(Questions);
}, [Questions]);

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
          {Questions.map((q, index) => (
            <tr
              key={q.id}
              style={{
                ...styles.row,
                backgroundColor: index % 2 === 0 ? "#1e1e1e" : "#121212",
              }}
            >
              <td style={styles.td}>
                {q.status ==="SOLVED"? (
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
                    (q.submission && q.acceptance && (Number(q.submission/q.acceptance*100))>=75)
                      ? "#90ee90"
                      : (q.submission && q.acceptance && (Number(q.submission/q.acceptance*100))>=50)
                      ? "#ffa500"
                      : "#ff4500",
                }}
              >
                {q.submission && q.acceptance &&(q.submission/q.acceptance*100)>=75?"EASY":(q.submission && q.acceptance &&(q.submission/q.acceptance*100)>=50)?"MEDIUM":"HARD"}
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
