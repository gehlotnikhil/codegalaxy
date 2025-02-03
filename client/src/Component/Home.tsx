import Hero from "./Hero";
import PraticeCourse from "./PraticeCourse";
import Problem from "./Problem";
import img from "../assets/img6.jpg"

function Home() {
  return (
    <>
    {/* <div style={{backgroundColor:"#1b1919"}}> */}
    <div
      className=" d-flex justify-content-center align-items-center vh-100"
      style={{
        backgroundImage: `url(${img})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >      <Hero/>
    </div>
      <div>
        <PraticeCourse />
      </div>
      <div>
        <Problem />
      </div>
    </>
  );
}

export default Home;
