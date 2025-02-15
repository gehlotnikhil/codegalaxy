import { Request, Response, Router } from "express";
import { PrismaClient } from "@prisma/client";
import { body, check, Result, validationResult } from "express-validator";
import UserFunctions from "../lib/UserFunctions";

const router = Router();
const ServerUrl = process.env.ServerUrl || "http://localhost:8000"
console.log(ServerUrl);
const prisma = new PrismaClient();

router.get("/", (req: Request, res: Response) => {
  res.send({ success: "OneToOneCompete Routing is on" });
});


router.post(
  "/createonetoonecompeteleaderboard",
  [
    body("user", "Please Enter a both user id").exists()
    
  ],
  async (req: Request, res: Response): Promise<any> => {
    let success = false;
    try {
      let error = validationResult(req);
      if (!error.isEmpty()) {
        return res.status(404).send({ success, error: error.array() });
      }
      
      let {user} = req.body;
      console.log("user-", user);
      const allid = [user[0].id,user[1].id]
      let check1 = await prisma.user.findMany({where:{id:{in:[...allid]}}})
      console.log("check1 - ",check1);
      if(check1.length!==2)  return res.send({success,msg:`User Id not found - ${user}`})
      
      let t = await prisma.problemSet.count()
      console.log("count - ",t);
      const randomNumber = Math.floor(Math.random() * t) + 1;
      const problem = await prisma.problemSet.findFirst({where:{problemNo:randomNumber}})
      if(!problem) return res.send({success,msg:"Problem not found"})
      
      let result = await prisma.oneToOneCompeteLeaderboard.create({
        data: {
            user,
            Result:"TIE", 
            duration:20,
            problemId:problem.id 
        },
      });
      
      let result2 = await prisma.user.updateMany({where:{id:{in:[...allid]}},data:{
        oneToOneCompeteLeaderboardId:{push:result.id}
      }})
      console.log("result - ",result);
      console.log("result2 - ",result2);

      success = true;
      return res.send({ success ,result,msg: "Compete Leaderboard Created" });
    } catch (error) {
      console.log(error);
      return res.status(500).send({ success, error,msg:"Internal Server Error" });
    }
  }
);

router.put(
  "/updateonetoonecompeteleaderboard",
  [
    body("Result", "Please enter a result").exists(),
    body("leaderboardId", "Please enter a leaderboardId").exists()
  ],
  async (req: Request, res: Response): Promise<any> => {
    let success = false;
    try {
      let error = validationResult(req);
      if (!error.isEmpty()) {
        return res.status(404).send({ success, error: error.array() });
      }
      let {Result,leaderboardId} = req.body
      const u1 = await prisma.oneToOneCompeteLeaderboard.findFirst({where:{id:leaderboardId}})
      if(!u1) return res.send({success,msg:"Leaderboard not found"})
        const startDate = new Date(u1.createdAt);
        const durationMs = u1.duration * 60 * 1000;
        const endDate = new Date(startDate.getTime() + durationMs);

        const currentTime = new Date().getTime();

        const remainingTime = endDate.getTime() - currentTime;
                console.log(`Remaining time: ${remainingTime / 1000} seconds`);

        if (remainingTime < 0) {
          return res.send({success,msg:"Battle Ended"})
        }





      const check2 = await prisma.user.findFirst({where:{id:Result}})
      if(!check2) return res.send({success,msg:"Result - UserId not found"})
      let newresult = "TIE";
      if(u1.Result === "TIE"){
        newresult = Result
      }
      
      if(u1.Result !== "TIE"){
        if(Result === u1.Result){
          return res.send({success,msg:"You Won"})
        }
        return res.send({success,msg:"Your Opponent Won"})
      }

      const result = await prisma.oneToOneCompeteLeaderboard.update({where:{id:leaderboardId},
      data:{
        Result:newresult
      }})

      

      success = true;
      return res.send({ success ,result,msg: "Updated Leaderboard" });
    } catch (error) {
      console.log(error);
      return res.status(500).send({ success, error,msg:"Internal Server Error" });
    }
  }
);
router.get(
  "/getonetoonecompeteleaderboard/:userid",
  async (req: Request, res: Response): Promise<any> => {
    let success = false;
    try {
      let error = validationResult(req);
      if (!error.isEmpty()) {
        return res.status(404).send({ success, error: error.array() });
      }

      const userid = req.params.userid;

      const result1 = await prisma.oneToOneCompeteLeaderboard.findMany({
        where: { user: { some: { id: userid } } }, 
      });


      if (result1.length === 0) return res.send({ success, msg: "User does not exist" });

      const r = result1.map((e) => {
        (e as any).user=e.user[0].id===userid? e.user[1]:e.user[0]
        const startDate = new Date(e.createdAt);
        const durationMs = e.duration * 60 * 1000;
        const endDate = new Date(startDate.getTime() + durationMs);

        const currentTime = new Date().getTime();

        const remainingTime = endDate.getTime() - currentTime;
                console.log(`Remaining time: ${remainingTime / 1000} seconds`);

        if (remainingTime > 0) {
          (e as any).status = "ACTIVE";
        } else {
          (e as any).status = "INACTIVE";
        }

        return e;
      });
      console.log(r);
       
      success = true;
      return res.send({ success, result:r, msg: "Done" });
    } catch (error) {
      console.log(error);
      return res.status(500).send({ success, error, msg: "Internal Server Error" });
    }
  }
);




module.exports = router;
