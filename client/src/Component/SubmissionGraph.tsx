import React from "react";

type SubmissionGraphProps = {
  activeDays: number[]; // Array of active day numbers (1-365)
};

const SubmissionGraph: React.FC<SubmissionGraphProps> = ({ activeDays }) => {
  const daysInYear = 365;
  // const months = [
  //   "Jan",
  //   "Feb",
  //   "Mar",
  //   "Apr",
  //   "May",
  //   "Jun",
  //   "Jul",
  //   "Aug",
  //   "Sep",
  //   "Oct",
  //   "Nov",
  //   "Dec",
  // ];

  // Create an array representing the year's activity
  const activityData = Array.from({ length: daysInYear }, (_, index) =>
    activeDays.includes(index + 1)
  );

  const maxStreak = activityData.reduce((max, current, index) => {
    if (current) {
      let streak = 1;
      for (let i = index + 1; i < activityData.length && activityData[i]; i++) {
        streak++;
      }
      return Math.max(max, streak);
    }
    return max;
  }, 0);

  const totalActiveDays = activeDays.length;

  return (
    <div style={{ fontFamily: "Arial, sans-serif", padding: "20px"  }}>
      <h3>{totalActiveDays} submissions in the past one year</h3>
      <p>
        Total active days: {totalActiveDays} | Max streak: {maxStreak}
      </p>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(53, 10px)",
          gap: "2px",
          position: "relative",
        }}
      >
        {activityData.map((active, index) => (
          <div
            key={index}
            style={{
              width: "10px",
              height: "10px",
              backgroundColor: active ? "#4caf50" : "#D9D9D9",
              borderRadius: "2px",
              // border: "1px solid #222",
            }}
          ></div>
        ))}
      </div>
      {/* <div
  style={{
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(80px, 1fr))", // Dynamic column widths
    gap: "2px",
    marginTop: "10px",
    position: "relative",
  }}
>
  {months.map((month, index) => (
    <div
      key={index}
      style={{
        fontSize: "12px",
        color: "#888",
        textAlign: "center", // Center align the text
      }}
    >
      {month}
    </div>
  ))}
</div> */}

    </div>
  );
};

export default SubmissionGraph;
