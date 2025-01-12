
const QuestionHeading = () => {
  return (
    <div style={styles.card}>
      <div style={styles.titleContainer}>
        <h1 style={styles.title}>1. Two Sum</h1>
        <div style={styles.status}>
          <span style={styles.solvedText}>Solved</span>
          <span style={styles.checkmark}>✔️</span>
        </div>
      </div>
    </div>
  );
};

const styles = {
  card: {
    backgroundColor: "#1e1e1e",
    padding: "20px",
    borderRadius: "8px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    width: "400px",
    color: "white",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  titleContainer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
  title: {
    fontSize: "18px",
    margin: 0,
  },
  status: {
    display: "flex",
    alignItems: "center",
    gap: "5px",
    color: "#4caf50",
  },
  solvedText: {
    fontSize: "14px",
  },
  checkmark: {
    fontSize: "16px",
  },
};

export default QuestionHeading;
