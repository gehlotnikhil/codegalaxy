import React, { useEffect, useState } from "react";

interface RatingProps {
  number: number;
}

const RatingDisplay: React.FC<RatingProps> = ({ number }) => {
  const getStars = (num: number) => {
    if (num >= 1000 && num <= 1100) {
      return 1;
    } else if (num > 1101 && num <= 1200) {
      return 2;
    } else if (num >= 1201) {
      return 3;
    }

    return 0;
  };
  const [division, setDivision] = useState(() => {
    const num: number = number;
    if (num >= 1000 && num <= 1100) {
      return 3;
    } else if (num > 1101 && num <= 1200) {
      return 2;
    } else if (num >= 1201) {
      return 1;
    }
  });
  useEffect(() => {
    setDivision(() => {
      const num: number = number;
      if (num >= 1000 && num <= 1100) {
        return 3;
      } else if (num > 1101 && num <= 1200) {
        return 2;
      } else if (num >= 1201) {
        return 1;
      }
    });
  }, []);

  useEffect(() => {
    console.log("division - ",division);
  }, [division]);

  const stars = getStars(number);

  return (
    <div style={{ textAlign: "center", fontFamily: "Arial, sans-serif" }}>
      <h1 style={{ fontSize: "48px", margin: "0" }}>{number}</h1>
      <p style={{ fontSize: "18px", margin: "5px 0" }}>Div ({division})</p>
      <div>
        {Array.from({ length: stars }).map((_, index) => (
          <span key={index} style={{ fontSize: "24px", color: "#FFD700" }}>
            ★
          </span>
        ))}
        {stars === 0 && (
          <span style={{ fontSize: "24px", color: "#ccc" }}>☆</span>
        )}
      </div>
    </div>
  );
};

export default RatingDisplay;
