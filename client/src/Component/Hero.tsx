"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function Hero() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (event: MouseEvent) => {
    const { clientX, clientY } = event;
    setMousePosition({ x: clientX, y: clientY });
  };

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  const floatingVariant = {
    initial: { y: 0, opacity: 0 },
    animate: {
      y: [0, -15, 0],
      opacity: 1,
      transition: {
        y: {
          duration: 3,
          ease: "easeInOut",
          repeat: Infinity,
        },
        opacity: {
          duration: 0.8,
          ease: "easeInOut",
        },
      },
    },
  };

  return (
    <>
      <motion.svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 109.19 122.88"
        className="d-none d-lg-block position-absolute"
        style={{
          x: mousePosition.x * 0.04,
          y: mousePosition.y * 0.04,
          height: "3.5rem",
          width: "3.5rem",
          position: "absolute",
          top: "12rem",
          left: "14rem",
        }}
        variants={floatingVariant}
        initial="initial"
        animate="animate"
      >
        <g>
          <path
            fill="#3949AB"
            d="M107.81,92.16c0.86-1.48,1.39-3.16,1.39-4.66V35.38c0-1.5-0.53-3.17-1.39-4.66L54.6,61.44L107.81,92.16z"
          />
          <path
            fill="#283593"
            d="M59.33,121.75l45.14-26.06c1.3-0.75,2.48-2.05,3.34-3.53L54.6,61.44L1.39,92.16c0.86,1.48,2.04,2.78,3.34,3.53l45.14,26.06C52.47,123.25,56.72,123.25,59.33,121.75z"
          />
          <path
            fill="#5C6BC0"
            d="M107.81,30.72c-0.86-1.48-2.04-2.78-3.34-3.53L59.33,1.13c-2.6-1.5-6.86-1.5-9.46,0L4.73,27.19C2.13,28.69,0,32.38,0,35.38V87.5c0,1.5,0.53,3.17,1.39,4.66L54.6,61.44L107.81,30.72z"
          />
          <path
            fill="#FFFFFF"
            d="M54.6,97.84c-20.07,0-36.4-16.33-36.4-36.4s16.33-36.4,36.4-36.4c12.95,0,25.03,6.97,31.52,18.19l-15.75,9.12c-3.25-5.62-9.29-9.1-15.77-9.1c-10.04,0-18.2,8.16-18.2,18.2c0,10.03,8.16,18.2,18.2,18.2c6.48,0,12.52-3.49,15.77-9.1l15.75,9.12C79.63,90.87,67.55,97.84,54.6,97.84z"
          />
        </g>
      </motion.svg>

      <motion.svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 109.19 122.88"
        className="d-none d-lg-block position-absolute"
        style={{
          x: mousePosition.x * 0.04,
          y: mousePosition.y * 0.04,
          height: "3.5rem",
          width: "3.5rem",
          position: "absolute",
          top: "5rem",
          right: "14rem",
        }}
        variants={floatingVariant}
        initial="initial"
        animate="animate"
      >
        <g>
          <path
            fill="#00599C"
            d="M107.81,92.16c0.86-1.48,1.39-3.16,1.39-4.66V35.38c0-1.5-0.53-3.17-1.39-4.66L54.6,61.44L107.81,92.16z"
          />
          <path
            fill="#004482"
            d="M59.33,121.75l45.14-26.06c1.3-0.75,2.48-2.05,3.34-3.53L54.6,61.44L1.39,92.16c0.86,1.48,2.04,2.78,3.34,3.53l45.14,26.06C52.47,123.26,56.73,123.26,59.33,121.75z"
          />
          <path
            fill="#659AD2"
            d="M107.81,30.72c-0.86-1.48-2.04-2.78-3.34-3.53L59.33,1.13c-2.6-1.5-6.86-1.5-9.46,0L4.73,27.19C2.13,28.69,0,32.37,0,35.38V87.5c0,1.5,0.53,3.17,1.39,4.66L54.6,61.44L107.81,30.72z"
          />
          <path
            fill="#FFFFFF"
            d="M54.6,97.84c-20.07,0-36.4-16.33-36.4-36.4c0-20.07,16.33-36.4,36.4-36.4c12.95,0,25.03,6.97,31.52,18.19l-15.75,9.12c-3.25-5.62-9.29-9.1-15.77-9.1c-10.04,0-18.2,8.16-18.2,18.2c0,10.03,8.16,18.2,18.2,18.2c6.48,0,12.52-3.49,15.77-9.1l15.75,9.12C79.63,90.87,67.55,97.84,54.6,97.84z"
          />
          <polygon
            fill="#FFFFFF"
            points="91,59.42 86.95,59.42 86.95,55.37 82.91,55.37 82.91,59.42 78.86,59.42 78.86,63.46 82.91,63.46 82.91,67.51 86.95,67.51 86.95,63.46 91,63.46 91,59.42"
          />
          <polygon
            fill="#FFFFFF"
            points="106.16,59.42 102.12,59.42 102.12,55.37 98.07,55.37 98.07,59.42 94.03,59.42 94.03,63.46 98.07,63.46 98.07,67.51 102.12,67.51 102.12,63.46 106.16,63.46 106.16,59.42"
          />
        </g>
      </motion.svg>

      <motion.svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 90.63 122.88"
        style={{
          position: "absolute",
          bottom: "5rem",
          left: "10rem",
          height: "3.5rem",
          width: "3.5rem",
          x: mousePosition.x * 0.04,
          y: mousePosition.y * 0.04,
        }}
        variants={floatingVariant}
        initial="initial"
        animate="animate"
      >
        <g>
          <path
            fill="#5382A1"
            d="M29.19,95.03c0,0-4.7,2.73,3.34,3.65c9.74,1.11,14.71,0.95,25.44-1.08c0,0,2.82,1.77,6.76,3.3C40.68,111.22,10.29,100.31,29.19,95.03L29.19,95.03z"
          />
          <path
            fill="#5382A1"
            d="M26.25,81.58c0,0-5.27,3.9,2.78,4.73c10.4,1.07,18.62,1.16,32.83-1.58c0,0,1.97,1.99,5.06,3.08C37.83,96.32,5.43,88.48,26.25,81.58L26.25,81.58z"
          />
          <path
            fill="#E76F00"
            d="M51.03,58.76c5.93,6.82-1.56,12.96-1.56,12.96s15.05-7.77,8.14-17.5C51.15,45.15,46.2,40.64,73,25.1C73,25.1,30.94,35.6,51.03,58.76L51.03,58.76z"
          />
          <path
            fill="#5382A1"
            d="M82.84,104.98c0,0,3.47,2.86-3.83,5.08c-13.88,4.21-57.79,5.48-69.99,0.17c-4.38-1.91,3.84-4.55,6.42-5.11c2.7-0.59,4.24-0.48,4.24-0.48c-4.88-3.43-31.52,6.74-13.53,9.66C55.2,122.25,95.56,110.72,82.84,104.98L82.84,104.98z"
          />
          <path
            fill="#5382A1"
            d="M31.45,67.64c0,0-22.33,5.3-7.91,7.23c6.09,0.82,18.23,0.63,29.54-0.32c9.24-0.78,18.52-2.44,18.52-2.44s-3.26,1.4-5.62,3.01c-22.68,5.96-66.49,3.19-53.88-2.91C22.77,67.05,31.45,67.64,31.45,67.64L31.45,67.64z"
          />
          <path
            fill="#5382A1"
            d="M71.51,90.03c23.05-11.98,12.39-23.49,4.95-21.94c-1.82,0.38-2.64,0.71-2.64,0.71s0.68-1.06,1.97-1.52c14.72-5.17,26.04,15.26-4.75,23.36C71.05,90.64,71.4,90.32,71.51,90.03L71.51,90.03z"
          />
          <path
            fill="#E76F00"
            d="M57.61,0c0,0,12.77,12.77-12.11,32.41c-19.95,15.75-4.55,24.74-0.01,35C33.85,56.91,25.3,47.66,31.03,39.05C39.45,26.41,62.76,20.29,57.61,0L57.61,0z"
          />
          <path
            fill="#5382A1"
            d="M33.71,122.49c22.13,1.42,56.11-0.79,56.92-11.26c0,0-1.55,3.97-18.29,7.12c-18.89,3.55-42.18,3.14-56,0.86C16.34,119.22,19.17,121.56,33.71,122.49L33.71,122.49z"
          />
        </g>
      </motion.svg>

      <motion.svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 122.88 45.91"
        style={{
          position: "absolute",
          bottom: "12rem",
          right: "10rem",
          height: "3.5rem",
          width: "3.5rem",
          x: mousePosition.x * 0.04,
          y: mousePosition.y * 0.04,
        }}
        variants={floatingVariant}
        initial="initial"
        animate="animate"
      >
        <g>
          <path
            fill="#00ACD7"
            d="M9.27,13.9c-0.24,0-0.3-0.12-0.18-0.3l1.26-1.62c0.12-0.18,0.42-0.3,0.66-0.3l21.36,0c0.24,0,0.3,0.18,0.18,0.36l-1.02,1.56c-0.12,0.18-0.42,0.36-0.6,0.36L9.27,13.9L9.27,13.9z"
          />
          <path
            fill="#00ACD7"
            d="M0.24,19.41c-0.24,0-0.3-0.12-0.18-0.3l1.26-1.62c0.12-0.18,0.42-0.3,0.66-0.3h27.28c0.24,0,0.36,0.18,0.3,0.36l-0.48,1.44c-0.06,0.24-0.3,0.36-0.54,0.36L0.24,19.41L0.24,19.41z"
          />
          <path
            fill="#00ACD7"
            d="M14.72,24.91c-0.24,0-0.3-0.18-0.18-0.36l0.84-1.5c0.12-0.18,0.36-0.36,0.6-0.36l11.97,0c0.24,0,0.36,0.18,0.36,0.42l-0.12,1.44c0,0.24-0.24,0.42-0.42,0.42L14.72,24.91L14.72,24.91z"
          />
          <path
            fill="#00ACD7"
            d="M76.82,12.82c-3.77,0.96-6.34,1.68-10.05,2.63c-0.9,0.24-0.96,0.3-1.74-0.6c-0.9-1.02-1.56-1.67-2.81-2.27c-3.77-1.85-7.42-1.32-10.83,0.9c-4.07,2.63-6.16,6.52-6.1,11.37c0.06,4.79,3.35,8.73,8.08,9.39c4.07,0.54,7.48-0.9,10.17-3.95c0.54-0.66,1.02-1.38,1.62-2.21c-2.15,0-4.85,0-11.55,0c-1.26,0-1.56-0.78-1.14-1.79c0.78-1.85,2.21-4.97,3.05-6.52c0.18-0.36,0.6-0.96,1.5-0.96h21.78c-0.12,1.62-0.12,3.23-0.36,4.85c-0.66,4.31-2.27,8.26-4.91,11.73c-4.31,5.68-9.93,9.21-17.05,10.17c-5.86,0.78-11.31-0.36-16.09-3.95c-4.43-3.35-6.94-7.78-7.6-13.28c-0.78-6.52,1.14-12.38,5.09-17.53c4.25-5.56,9.87-9.09,16.75-10.35c5.62-1.02,11.01-0.36,15.85,2.93c3.17,2.09,5.44,4.97,6.94,8.44C77.78,12.35,77.54,12.64,76.82,12.82L76.82,12.82L76.82,12.82z"
          />
          <path
            fill="#00ACD7"
            d="M96.62,45.91c-5.44-0.12-10.41-1.68-14.6-5.26c-3.53-3.05-5.74-6.94-6.46-11.55c-1.08-6.76,0.78-12.74,4.85-18.07c4.37-5.74,9.63-8.73,16.75-9.99c6.1-1.08,11.85-0.48,17.05,3.05c4.73,3.23,7.66,7.6,8.44,13.34c1.02,8.08-1.32,14.66-6.88,20.28c-3.95,4.01-8.79,6.52-14.36,7.66C99.79,45.67,98.18,45.73,96.62,45.91L96.62,45.91L96.62,45.91z M110.86,21.74c-0.06-0.78-0.06-1.38-0.18-1.97c-1.08-5.92-6.52-9.27-12.21-7.96c-5.56,1.26-9.15,4.79-10.47,10.41c-1.08,4.67,1.2,9.39,5.5,11.31c3.29,1.44,6.58,1.26,9.75-0.36C107.99,30.71,110.56,26.88,110.86,21.74L110.86,21.74z"
          />
        </g>
      </motion.svg>

      <motion.div style={{minHeight:"90vh"}} className=" text-white  d-flex flex-column align-items-center justify-content-center">
        {/* Main Content */}
        <div className="text-center mt-5">
          <h2
            className="fw-light"
            style={{ fontSize: "1.875rem", lineHeight: "2.25rem" }}
          >
            Welcome to
          </h2>
          <h1 className="custom-heading">
            <span className="gradient-text">Code</span>Galaxy.
          </h1>{" "}
          <p className="custom-paragraph">
      A platform where you'll find the right content to help you improve your skills and grow your knowledge.
    </p>
        </div>
      </motion.div>
    </>
  );
}
