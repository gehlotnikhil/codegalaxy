import React, {  useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { RootStateType } from "../store";
import { apiFetch } from '../utils/api';

type CardProps = {
  headerColor: string;
  icon: string;
  title: string;
  description: string;
  problems: number;
  level: string;
  course:string;
};

const Card: React.FC<CardProps> = ({ headerColor, icon, title, description, problems, level,course }) => {
 const navigate = useNavigate()

  
  return (
    <div style={{ ...styles.card, borderTop: `6px solid ${headerColor}` }}  >
      <div style={styles.header}>
        <div style={{ ...styles.iconContainer, backgroundColor: headerColor }}>
          <img src={icon} alt={`${title} icon`} style={styles.icon} />
        </div>
      </div>
      <h3 style={{...styles.title}} className="pratice-title" onClick={()=>navigate(`/pratice/${course}`)} >{title}</h3>
      <p style={styles.description}>{description}</p>
      <div style={styles.info}>
        <div>
          <span role="img" aria-label="document">
            📄
          </span>{" "}
          {problems} Problems
        </div>
        <div>
          <span role="img" aria-label="level">
            📊
          </span>{" "}
          {level}
        </div>
      </div>
    </div>
  );
};

const PraticeCourse: React.FC = () => {
  const userDetail = useSelector((state:RootStateType)=>state.userDetail)
  const [EntireLanguageCount, setEntireLanguageCount] = useState({c:0,cpp:0,java:0,go:0})
  useEffect(() => {
    console.log("EntireLanguageCount--",EntireLanguageCount);
    
  }, [EntireLanguageCount])
  
  useEffect(() => {
    loadProblemDetail("c")
  }, [])
 const loadProblemDetail = async(language:string)=>{
   try {
     const result = await apiFetch(`/api/problemset/getpraticeproblemdetails`,{
       method: "POST",
       headers: {
         "Content-Type": "application/json",
       },
       body: JSON.stringify({
         token:userDetail.token,
         language:language
       }),
     })
     const jsondata  = await result
     console.log("jsondata--",jsondata);
     if(jsondata.success){
       setEntireLanguageCount(jsondata.entireCount)
     }
     
   } catch (error) {
     console.log(error);
     
   }
 }

  const cards = [
    {
      course:"c",
      headerColor: "#1e90ff", // Blue for C
      icon: "https://upload.wikimedia.org/wikipedia/commons/3/35/The_C_Programming_Language_logo.svg",
      title: "Practice C",
      description: "Solve C practice problems to enhance your skills. Dive into pointers, structures, and algorithms.",
      problems: EntireLanguageCount.c,
      level: "Beginner level",
    },
    {
      course:"cpp",
      headerColor: "#0066cc", // Darker blue for C++
      icon: "https://upload.wikimedia.org/wikipedia/commons/1/18/ISO_C%2B%2B_Logo.svg",
      title: "Practice C++",
      description: "Master C++ with coding challenges covering OOP, STL, and advanced programming topics.",
      problems: EntireLanguageCount.cpp,
      level: "Intermediate level",
    },
    {
      course:"java",
      headerColor: "#d87c1a", // Orange for Java
      icon: "https://upload.wikimedia.org/wikipedia/en/3/30/Java_programming_language_logo.svg",
      title: "Practice Java",
      description: "Explore Java concepts like OOP, multithreading, and collections through coding problems.",
      problems: EntireLanguageCount.java,
      level: "Beginner level",
    },
    {
      course:"go",
      headerColor: "#00ADD8", // Teal for Go
      icon: "https://go.dev/blog/go-brand/Go-Logo/PNG/Go-Logo_LightBlue.png",
      title: "Practice Go",
      description: "Solve Go problems to learn concurrency, Goroutines, and Efficient and data handling with ease.",
      problems: EntireLanguageCount.go,
      level: "Beginner level",
    },
  ];

  return (
    <div style={styles.container}>
      {cards.map((card, index) => (
        <Card key={index} {...card}  />
      ))}
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    gap: "20px",
    justifyContent: "center",
    alignItems: "flex-start",
    padding: "20px",
    backgroundColor: "#121212",
  },
  card: {
    backgroundColor: "#1e1e1e",
    borderRadius: "8px",
    width: "300px",
    padding: "16px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    color: "#fff",
    textAlign: "left" as const,
  },
  header: {
    marginBottom: "16px",
  },
  iconContainer: {
    width: "60px",
    height: "60px",
    borderRadius: "8px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  icon: {
    width: "40px",
    height: "40px",
    objectFit: "contain" as const,
  },
  title: {
    fontSize: "18px",
    fontWeight: "bold" as const,
    marginBottom: "8px",
  },
  description: {
    fontSize: "14px",
    marginBottom: "16px",
    color: "#bbb",
  },
  info: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "14px",
    color: "#ccc",
  },
};

export default PraticeCourse;
