import Hero from "./Hero";
import PraticeCourse from "./PraticeCourse";
import Problem from "./Problem";

function Home() {
  return (
    <>
    <div>
      <Hero/>
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
