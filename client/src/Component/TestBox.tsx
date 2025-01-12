import React from "react";

// Define the props for each TestBox
interface TestBoxProps {
  isSuccess?: "pass" | "failed" | "pending";
  testNo: number;
}

// Inline styles as JavaScript objects
const styles = {
  container: {
    display: "flex",
    gap: "20px",
    justifyContent: "left",
    alignItems: "center",
    marginTop: "20px",
  },
  box: {
    border: "1px solid #ddd",
    borderRadius: "8px",
    padding: "5px 5px",
    width: "15%",
    textAlign: "center" as const, // Explicit type for textAlign
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    fontFamily: "Arial, sans-serif",
  },
  status: {
    marginTop: "10px",
    fontSize: "24px",
  },
  success: {
    color: "green",
  },
  failure: {
    color: "red",
  },
  pending: {
    color: "yellow",
  },
};

// TestBox Component
const TestBox: React.FC<TestBoxProps> = ({  testNo,isSuccess }) => {
  return (
    <div style={styles.box}>
      <div>Test #{testNo}</div>
      <div
        style={{
          ...styles.status,
          ...(isSuccess ==="pass"?styles.success:(isSuccess==="failed"?styles.failure:styles.pending)),
        }}
      >
        {(isSuccess ==="pass"?"✔":(isSuccess==="failed"?"✖":"🕒"))}
      </div>
    </div>
  );
};
interface testType {
  isSuccess?:  "pass" | "failed" | "pending";
}

// Main Component
interface TestStatusProps {
  tests: testType[];
}

const TestStatus: React.FC<TestStatusProps> = (props ) => {
  // Example data for the tests
   

  return (
    <div style={styles.container}>
      {props.tests.map((test, index) => (
        <TestBox key={index} testNo={index+1} isSuccess={test.isSuccess} />
      ))}
    </div>
  );
};

export default TestStatus;
