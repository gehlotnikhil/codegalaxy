import React from "react";

// Define the props for each TestBox
interface TestBoxProps {
  testName: string;
  isSuccess: string;
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
const TestBox: React.FC<TestBoxProps> = ({ testName, isSuccess }) => {
  return (
    <div style={styles.box}>
      <div>{testName}</div>
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

// Main Component
const TestStatus: React.FC = () => {
  // Example data for the tests
  const tests = [
    { testName: "Test #1", isSuccess: "pass" },
    { testName: "Test #2", isSuccess: "failed" },
    { testName: "Test #3", isSuccess: "pending" },
  ];

  return (
    <div style={styles.container}>
      {tests.map((test, index) => (
        <TestBox key={index} testName={test.testName} isSuccess={test.isSuccess} />
      ))}
    </div>
  );
};

export default TestStatus;
