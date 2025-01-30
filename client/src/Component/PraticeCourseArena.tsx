import { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import PraticeProblem from "./PraticeProblem";
import { useSelector } from "react-redux";
import { RootStateType } from "../store";
import { useParams } from "react-router";
import MainContext from "../context/main";


const PraticeCourseArena = () => {
  const userDetail = useSelector((state:RootStateType)=>state.userDetail)
  const params = useParams()
  const context = useContext(MainContext)
  const {SERVER_URL} = context
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  interface PraticeQuestionType{
    id?:string,
    problemName?:string,
    language?: "java"|"c"|"cpp"|"go",
    status?:"SOLVED"|"UNSOLVED"

  }

  
  const loadProblemDetail = async(language:string)=>{
    try {
      const result = await fetch(`${SERVER_URL}/api/problemset/getpraticeproblemdetails`,{
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token:userDetail.token,
          language:language
        }),
      })
      const jsondata  = await result.json()
      console.log("jsondata--",jsondata);
      if(jsondata.success){
        setPraticeQuestion(jsondata.result)
      }
      
    } catch (error) {
      console.log(error);
      
    }
  }
  useEffect(() => {
    console.log("language-",params.course);
    loadProblemDetail(params.course || "")
    setCourseName(()=>{
      const course = params.course
      if(course === "c") return "C"
      else if(course === "cpp") return "C++"
      else if(course === "java") return "Java"
      else if(course === "go") return "Go"
      
      return ""
    })
  }, [])
  const [ProgressPercent, setProgressPercent] = useState<number>(0)
  useEffect(() => {
    console.log(ProgressPercent);
     }, [ProgressPercent])
  const [PraticeQuestion, setPraticeQuestion] = useState<PraticeQuestionType[]>([])
  useEffect(() => {
    console.log(PraticeQuestion);
    let Count =0;
    PraticeQuestion.map((v)=>{
      if(v.status === "SOLVED")
        Count++;
      return v
    })
    setProgressPercent(()=>Number(((Count/PraticeQuestion.length)*100).toFixed(0)) )
 
  }, [PraticeQuestion])
  
  const [CourseName, setCourseName] = useState("")
  useEffect(() => {
    console.log(CourseName);
    
  }, [CourseName])
  
  return (
    <Wrapper>
      <br />
      <br />
      <br />
      
      <Logo>{CourseName}</Logo>
      <Title>Practice {CourseName}</Title>
      <Description>
        Solve {CourseName} Practice problems online with the Practice {CourseName} path on
        CodeGalaxy. Answer MCQs exercises and write code for over {PraticeQuestion.length} {CourseName} coding
        challenges.
      </Description>
      <Stats>
        <Stat>
          <span>4.5 ⭐</span>
          <p>(11036 reviews)</p>
        </Stat>
        <Stat>
          <span>{PraticeQuestion.length}</span>
          <p>Problems</p>
        </Stat>
        <Stat>
          <span>76</span>
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
        {rating > 0
          ? `You rated: ${rating} star${rating > 1 ? "s" : ""}`
          : "Rate this course!"}
      </p>

      <Button>Start Practice</Button>
      <ProgressBarContainer>
        <ProgressBar style={{ width: `${ProgressPercent || 0}%` }} />
      </ProgressBarContainer>
      <ProgressLabel>
        <span>Your Progress:</span>
        <span>{ProgressPercent || 0}%</span>
      </ProgressLabel>
      <br />
      <br />
      <PraticeProblem  Question={PraticeQuestion}/>
    </Wrapper>
  );
};

export default PraticeCourseArena;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  min-height: 100vh;
  background-color: #0f172a;
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
  margin-bottom: 20px;
  color: #ffffff;
`;

const Title = styled.h1`
  font-size: 28px;
  font-weight: bold;
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
  justify-content: space-around;
  width: 100%;
  max-width: 800px;
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
  padding: 12px 24px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  margin-bottom: 30px;

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
    color: #ffd700;
  }
`;

const ProgressBarContainer = styled.div`
  background-color: #334155;
  border-radius: 6px;
  height: 10px;
  width: 80%;
  max-width: 800px;
  position: relative;
  overflow: hidden;
  margin-bottom: 10px;
`;

const ProgressBar = styled.div`
  height: 100%;
  background-color: #3b82f6;
  width: 0%;
  transition: width 0.3s ease-in-out;
`;

const ProgressLabel = styled.div`
  display: flex;
  justify-content: space-between;
  width: 80%;
  max-width: 800px;
  font-size: 14px;
  color: #94a3b8;
`;
