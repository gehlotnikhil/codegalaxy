import React from "react";

type SubmissionGraphProps = {
  activeDays: number[];
};

const SubmissionGraph: React.FC<SubmissionGraphProps> = ({ activeDays }) => {
  const daysInYear = 365;
  const weeksInYear = Math.ceil(daysInYear / 7);

  const activityData = Array.from({ length: daysInYear }, (_, index) => ({
    day: index + 1,
    active: activeDays.includes(index + 1),
  }));

  return (
    <div className="submission-graph">
      <h3>{activeDays.length} Active Days in Current Year</h3>
      <div className="grid-container">
        {activityData.map(({ day, active }) => (
          <div
            key={day}
            title={`Day ${day}`}
            className={`grid-item `}
            id={`${active ? "active" : "inactive"}`}
          ></div>
        ))}
      </div>
      <style >{`
        .submission-graph {
          font-family: Arial, sans-serif;
          padding: 20px;
          text-align: center;
          background: #0d1117;
          color: white;
        }

        .grid-container {
          display: grid;
          grid-template-columns: repeat(${weeksInYear}, minmax(8px, 12px));
          grid-template-rows: repeat(7, minmax(8px, 12px));
          gap: 3px;
          justify-content: center;
          margin: 10px auto;
        }

        .grid-item {
          width: 10px;
          height: 10px;
          border-radius: 2px;
          transition: background-color 0.2s ease-in-out;
        }

        #active {
          background-color: #1bc71b;
        }

        #inactive {
          background-color: #3a3a3a;
        }

        @media (max-width: 1200px) {
          .grid-container {
            grid-template-columns: repeat(30, minmax(6px, 10px));
          }
        }

        @media (max-width: 768px) {
          .grid-container {
            grid-template-columns: repeat(15, minmax(5px, 8px));
          }
          h3 {
            font-size: 18px;
          }
        }

        @media (max-width: 480px) {
          .grid-container {
            grid-template-columns: repeat(7, minmax(4px, 6px));
          }
          h3 {
            font-size: 16px;
          }
        }
      `}</style>
    </div>
  );
};

export default SubmissionGraph;
