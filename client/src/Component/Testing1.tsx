import  { useState } from "react";
import styled from "styled-components";

const Testing1 = () => {
  const [rating, setRating] = useState(0); // To store the user's rating
  const [hover, setHover] = useState(0);  // To highlight stars on hover

  const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100vh; /* Full height of the viewport */
    background-color: #0f172a; /* Background color for the application */
    font-family: "Poppins", sans-serif;
    color: #ffffff;
  `;

  const Logo = styled.div`
    width: 80px;
    height: 80px;
    background-color: #3b82f6;
    border-radius: 12px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 36px;
    font-weight: bold;
    color: #ffffff;
    margin-bottom: 20px;
  `;

  const Title = styled.h1`
    font-size: 24px;
    font-weight: bold;
    margin: 0;
    margin-bottom: 10px;
  `;

  const Description = styled.p`
    font-size: 16px;
    color: #94a3b8;
    text-align: center;
    margin: 0 20px 30px;
    line-height: 1.6;
  `;

  const Stats = styled.div`
    display: flex;
    justify-content: center;
    gap: 50px;
    margin-bottom: 30px;
  `;

  const Stat = styled.div`
    text-align: center;

    span {
      font-size: 20px;
      font-weight: bold;
      color: #ffffff;
    }

    p {
      font-size: 14px;
      color: #cbd5e1;
    }
  `;

  const Button = styled.button`
    background-color: #3b82f6;
    color: white;
    border: none;
    border-radius: 6px;
    padding: 10px 20px;
    font-size: 16px;
    font-weight: bold;
    cursor: pointer;
    margin-bottom: 20px;

    &:hover {
      background-color: #2563eb;
    }
  `;

  const RatingContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 20px;
  `;

  const Star = styled.span`
    font-size: 30px;
    cursor: pointer;
    transition: color 0.3s;

    &:hover {
      color: #ffd700; /* Gold on hover */
    }
  `;

  const ProgressBarContainer = styled.div`
    background-color: #334155;
    border-radius: 6px;
    height: 10px;
    width: 80%;
    position: relative;
    overflow: hidden;
    margin-bottom: 10px;
  `;

  const ProgressBar = styled.div`
    height: 100%;
    background-color: #3b82f6;
    width: 0%; /* Update dynamically based on progress */
    transition: width 0.3s ease-in-out;
  `;

  const ProgressLabel = styled.div`
    display: flex;
    justify-content: space-between;
    width: 80%;
    font-size: 14px;
    color: #94a3b8;
  `;

  return (
    <>
    <Wrapper>
      <Logo>C++</Logo>
      <Title>Practice C++</Title>
      <Description>
        Solve C++ Practice problems online with the Practice C++ path on CodeChef. Answer MCQs
        exercises and write code for over 200 C++ coding challenges.
      </Description>
      <Stats>
        <Stat>
          <span>4.5 ⭐</span>
          <p>(11036 reviews)</p>
        </Stat>
        <Stat>
          <span>206</span>
          <p>Problems</p>
        </Stat>
        <Stat>
          <span>76.4k</span>
          <p>Learners</p>
        </Stat>
      </Stats>

      {/* User Rating */}
      <RatingContainer>
        {[...Array(5)].map((_, index) => {
          const ratingValue = index + 1;
          return (
            <Star
              key={index}
              style={{
                color: ratingValue <= (hover || rating) ? "#FFD700" : "#CBD5E1",
              }}
              onClick={() => setRating(ratingValue)}
              onMouseEnter={() => setHover(ratingValue)}
              onMouseLeave={() => setHover(0)}
            >
              ★
            </Star>
          );
        })}
      </RatingContainer>
      <p style={{ color: "#94a3b8" }}>
        {rating > 0 ? `You rated: ${rating} star${rating > 1 ? "s" : ""}` : "Rate this course!"} 
      </p>

      <Button>Start Practice</Button>
      <ProgressBarContainer>
        <ProgressBar style={{ width: "0%" }}  /> 
      </ProgressBarContainer>
      <ProgressLabel>
        <span>Your Progress:</span>
        <span>0% </span>
      </ProgressLabel>
    </Wrapper>
    
    </>
  );
};

export default Testing1;
