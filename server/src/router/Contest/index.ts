import { Request, response, Response, Router } from "express";
import nodemailer from "nodemailer";
import { withPrisma } from "../../lib/prisma_callback";
const ServerUrl = process.env.ServerUrl || "http://localhost:8000"
console.log(ServerUrl);
const router = Router();
const { body, validationResult } = require("express-validator");
router.get("/", (req: Request, res: Response) => {
  res.send({ success: "Contest Routing is on" });
});
// console.log("-->",prisma);


router.post(
  "/notify-all-users",
  [
    body("contestName", "Please Enter a contestName").exists(),
    body("duration", "Please Enter a duration").exists(),
  ],
  withPrisma(async (req: Request, res: Response,prisma:any): Promise<any> => {
    let success = false;

    // Validate request body
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success, errors: errors.array() });
    }

    const { contestName, duration } = req.body;
    

    try {
      // Fetch all users' emails from the database
      const users = await prisma.user.findMany({ select: { email: true } });
      const emails = users.map((user: { email: any; }) => user.email);

      if (emails.length === 0) {
        return res.status(400).json({ success, msg: "No users found to notify" });
      }

      // Set up Nodemailer transport
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          type: "OAuth2",
          user: process.env.EMAIL,
          clientId: process.env.CLIENT_ID,
          clientSecret: process.env.CLIENT_SECRET,
          refreshToken: process.env.REFRESH_TOKEN,
        },
      });

      // Email options
      const mailOptions = (email: string) => ({
        from: process.env.EMAIL,
        to: email,
        subject: `New Contest: ${contestName}!`,
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px;">
            <h2 style="color: #000;">CodeGalaxy Contest Alert!</h2>
            <h1 style="color: #0078D4;">${contestName}</h1>
            <p>We are excited to announce a new contest!</p>
            <p><strong>Duration:</strong> ${duration}</p>
            <p>Prepare yourself and start coding!</p>
            <p>Thanks, <br> The CodeGalaxy Team</p>
          </div>
        `,
      });

      // Send emails concurrently
      const emailPromises = emails.map((email: string) =>
        transporter.sendMail(mailOptions(email)).catch((err) => {
          console.error(`Failed to send email to ${email}:`, err);
          return null; // Handle failed emails gracefully
        })
      );

      await Promise.all(emailPromises);

      success = true;
      return res.json({ success, msg: "Emails sent successfully!" });
    } catch (error) {
      console.error("Error:", error);
      return res.status(500).json({ success, error });
    } 
  })
);



router.post(
  "/create",
  [
    body("contestName", "Please Enter a contestName").exists(),
    body("duration", "Please Enter a duration").exists(),
    body("problems", "Please Enter a problems's id").exists(),
  ],
  withPrisma(async (req: Request, res: Response,prisma:any): Promise<any> => {
    let success = false;
    

    try {
      let error = validationResult(req);
      if (!error.isEmpty()) {
        return res.status(404).send({ success, error: error.array() });
      }
      let {
        contestName,
        duration,
        problems,
      } = req.body;

      let newNumber = 1;
      let t = (await prisma.contest.findMany());
      console.log("1- ", t);
      console.log("1- ", t.length);
      if (t.length !== 0) {

        console.log(t[t.length - 1].contestNo);
        console.log("2- ", t[t.length - 1].contestNo);

        console.log(t);
        if (t.length > 0) {
          newNumber = t[t.length - 1].contestNo + 1;
        }
        console.log("3- ", newNumber);

      }


      for (const e of problems) {

        let response1 = await prisma.contestProblem.findFirst({ where: { id: e } });
        if (!response1) {
          return res.status(400).json({ success, msg: `${e} not found` });
        }
      }
      let result = await prisma.contest.create({
        data: {
          contestNo: newNumber,
          contestName,
          duration,
          problems,
        },
      });
      console.log(result);
      const response2 = await fetch(`${ServerUrl}/api/contest/leaderboard/create/${result.id}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" }
      })

      // notify all user


      success = true;

      return res.send({ success, body: req.body, msg: "Contest Created" });
    } catch (error) {
      console.log(error);
      return res.status(500).send({ success, error });
    } 
  })
);

router.put(
  "/update/:contestno",
  [],
 withPrisma(async (req: Request, res: Response,prisma:any): Promise<any> => {
    let success = false;
    

    try {
      let error = validationResult(req.body);
      if (!error.isEmpty()) {
        return res.status(404).send({ success, error: error.array() });
      }

      let query: any = {};
      if (req.body.contestName) {
        query.contestName = req.body.contestName;
      }
      if (req.body.startTime) {
        query.startTime = req.body.startTime;
      }
      if (req.body.duration) {
        query.duration = req.body.duration;
      }


      if (req.body.problems) {
        query.problems = req.body.problems;
      }
      if (Object.keys(query).length === 0) {
        return res.send({ success, msg: "Empty Content" });
      }
      let result = await prisma.contest.update({
        where: { contestNo: Number.parseInt(req.params.contestno) }, data: { ...query }
      });

      success = true;
      return res.send({ success, msg: "Update successfull" });
    } catch (error) {
      console.log(error);
      return res.status(500).send({ success, error });
    } 
  })
);
router.delete(
  "/delete/:contestno",
 withPrisma(async (req: Request, res: Response,prisma:any): Promise<any> => {
    let success = false;
    

    try {
      let check1 = await prisma.contest.findFirst({ where: { contestNo: Number.parseInt(req.params.contestno) } })
      if (!check1) {
        return res.send({ success, msg: "Contest not Exist" })
      }

      let result = await prisma.contest.delete({ where: { contestNo: Number.parseInt(req.params.contestno) } })
      await prisma.contest.updateMany({
        where: {
          contestNo: {
            gt: Number.parseInt(req.params.contestno),
          },
        },
        data: {
          contestNo: {
            decrement: 1, // Decrease the problemNo for each problem after the deleted one
          },
        },
      });

      success = true;
      return res.send({ success, msg: "Deleted", result });
    } catch (error) {
      console.log(error);
      return res.status(500).send({ success, error });
    } 
  })
);

router.post(
  "/getallcontest",
  [],
 withPrisma(async (req: Request, res: Response,prisma:any): Promise<any> => {
    let success = false;
    

    try {
      let result = await prisma.contest.findMany({
        select: {
          id: true,
          contestNo: true,
          contestName: true,
          duration: true,
          startTime: true,
          problems: true
        },
      });
      console.log(result);

      success = true;
      return res.send({ success, result });
    } catch (error) {
      console.log(error);
      return res.status(500).send({ success, error });
    } 
  })
);
router.get(
  "/getcontestproblemfromcontestid/:contestid",
 withPrisma(async (req: Request, res: Response,prisma:any): Promise<any> => {
    let success = false;
    

    try {
      const c = req.params.contestid;
      console.log("Contest ID:", c);

      let res1 = await prisma.contest.findFirst({ where: { id: c } });

      if (!res1) {
        return res.status(404).send({ success, msg: "Not found" });
      }

      const problemIds = res1.problems;
      console.log("Problem IDs:", problemIds);

      let result: any[] = [];

      for (const e of problemIds) {
        const problem = await prisma.contestProblem.findFirst({ where: { id: e } });
        console.log("Problem:", problem);

        if (problem) result.push(problem);
      }

      console.log("Final Result:", result);

      success = true;
      return res.send({ success, result });

    } catch (error) {
      console.error(error);
      return res.status(500).send({ success, error: "Internal Server Error" });
    } 
  })
);



router.get(
  "/getspecificcontest",
  [],
 withPrisma(async (req: Request, res: Response,prisma:any): Promise<any> => {
    let success = false;
    

    try {
      let { id, no } = req.query;
      if (!id && !no) {
        return res.send({ success, msg: "Please provide id or no" })
      }
      let result: null;
      if (no) {
        result = await prisma.contest.findFirst({ where: { contestNo: Number.parseInt(no as string) } })
      }
      if (id) {
        result = await prisma.contest.findFirst({ where: { id: (id as string) } })
      }
      if (result === null) {
        success = false;
      } else {
        success = true;
      }
      console.log(result);

      return res.send({ success, result });
    } catch (error) {
      console.log(error);
      return res.status(500).send({ success, error });
    } 
  })
);


router.get(
  "/leaderboard/create/:contestid",
  [],
 withPrisma(async (req: Request, res: Response,prisma:any): Promise<any> => {
    let success = false;
    

    try {
      let { contestid } = req.params;
      if (!contestid) {
        return res.send({ success, msg: "Please provide ContestId" })
      }
      let result: null;
      result = await prisma.leaderBoard.create({
        data: {
          contestid,
        }
      })

      if (result === null) {
        success = false;
      } else {
        success = true;
      }
      console.log(result);

      return res.send({ success, result });
    } catch (error) {
      console.log(error);
      return res.status(500).send({ success, error });
    } 
  })
);


router.put(
  "/leaderboard/update/:contestid",
  [
    body("problemid", "Please enter the problem id").exists(),
    body("userid", "Please enter the userid").exists(),
    body("startTime", "Please enter the startTime").exists(),
    body("duration", "Please enter the duration").exists()
  ],
 withPrisma(async (req: Request, res: Response,prisma:any): Promise<any> => {
    let success = false;
    

    try {

      let error = validationResult(req);
      if (!error.isEmpty()) {
        return res.status(404).send({ success, error: error.array() });
      }

      const { problemid, userid, startTime, duration } = req.body
      const { contestid } = req.params
      if (!problemid || !userid || !contestid || !startTime || !duration) {
        return res.send({ success, msg: "Paramater missing" })
      }

      const response1 = await prisma.leaderBoard.findFirst({ where: { contestid } })

      console.log(response1);
      if (!response1) return res.send({ success, msg: "Contest not exist" })

      const startDate = new Date(startTime);
      const durationMs = duration * 60 * 1000;
      const endDate = new Date(startDate.getTime() + durationMs);

      const remainingTime = endDate.getTime() - Date.now();

      if (remainingTime < 0) {
        return res.send({ success, msg: "Contest Ended" })
      } else {
        console.log(`Remaining time: ${remainingTime / 1000} seconds`);
      }

      const response2 = await prisma.user.findFirst({ where: { id: userid } })
      if (!response2) return res.send({ success, msg: "User not exist" })

      const response3 = await prisma.contestProblem.findFirst({ where: { id: problemid } })
      if (!response3) return res.send({ success, msg: "ContestProblem not exist" })

      console.log(response1);
      let UpdateleaderBoard = response1
      let flag = 0
      console.log("first - ", UpdateleaderBoard);
      let check1 = UpdateleaderBoard.participent
      check1.map((e: { userid: any; solvedProblem: string | any[]; }) => {
        console.log(e);
        if (e.userid === userid) {
          flag = 1;
          console.log("hello");

          let c = e.solvedProblem.includes(problemid)
          if (!c) e.solvedProblem = [...e.solvedProblem, problemid]
        }
        return e

      })
      if (flag === 0) { // if userid not found
        console.log("yellow");
        UpdateleaderBoard.participent = [...UpdateleaderBoard.participent, { userid: userid, solvedProblem: [problemid] }]
      }
      console.log(UpdateleaderBoard.participent);
      const result = await prisma.leaderBoard.update({
        where: {
          id: UpdateleaderBoard.id
        },
        data: {
          participent: UpdateleaderBoard.participent
        }
      })





      success = true;
      res.send({ success, msg: "Done" })
    } catch (error) {
      console.log(error);
      return res.status(500).send({ success, error });
    } 
  })
);

router.get(
  "/leaderboard/:contestid",
 withPrisma(async (req: Request, res: Response,prisma:any): Promise<any> => {
    let success = false;
    

    try {

      let error = validationResult(req);
      if (!error.isEmpty()) {
        return res.status(404).send({ success, error: error.array() });
      }
      const { contestid } = req.params
      if (!contestid) {
        return res.send({ success, msg: "Paramater missing" })
      }

      const response1 = await prisma.leaderBoard.findFirst({ where: { contestid } })
      console.log(response1);

      if (!response1) return res.send({ success, msg: "Leaderboard not exist" })

      success = true;
      res.send({ success, msg: "Done", result: response1 })
    } catch (error) {
      console.log(error);
      return res.status(500).send({ success, error });
    } 
  })
);

router.put(
  "/usercontestdetail/update/:contestid",
  [
    body("problemid", "Please enter the problem id").exists(),
    body("userid", "Please enter the userid").exists(),
  ],
 withPrisma(async (req: Request, res: Response,prisma:any): Promise<any> => {
    let success = false;
    

    try {

      let error = validationResult(req);
      if (!error.isEmpty()) {
        return res.status(404).send({ success, error: error.array() });
      }

      const { problemid, userid } = req.body
      const { contestid } = req.params
      if (!problemid || !userid || !contestid) {
        return res.send({ success, msg: "Paramater missing" })
      }

      const response1 = await prisma.leaderBoard.findFirst({ where: { contestid } })
      console.log(response1);
      if (!response1) return res.send({ success, msg: "Contest not exist" })

      const response2 = await prisma.user.findFirst({ where: { id: userid } })
      if (!response2) return res.send({ success, msg: "User not exist" })

      const response3 = await prisma.contestProblem.findFirst({ where: { id: problemid } })
      if (!response3) return res.send({ success, msg: "ContestProblem not exist" })


      console.log(response2);
      let UpdateUser = response2
      let flag = 0
      console.log("first - ", UpdateUser);
      let check1 = UpdateUser.ContestDetail
      check1.map((e: { contestid: string; solvedProblem: string | any[]; }) => {
        console.log(e);
        if (e.contestid === contestid) {
          flag = 1;
          console.log("hello");

          let c = e.solvedProblem.includes(problemid)
          if (!c) e.solvedProblem = [...e.solvedProblem, problemid]
        }
        return e

      })
      if (flag === 0) { // if userid not found
        console.log("yellow");
        UpdateUser.ContestDetail = [...UpdateUser.ContestDetail, { contestid: contestid, solvedProblem: [problemid] }]
      }
      console.log(UpdateUser.ContestDetail);
      const result = await prisma.user.update({
        where: {
          id: UpdateUser.id
        },
        data: {
          ContestDetail: UpdateUser.ContestDetail
        }
      })





      success = true;
      res.send({ success, msg: "Done" })
    } catch (error) {
      console.log(error);
      return res.status(500).send({ success, error });
    } 
  })
);

router.get(
  "/getcontestrank/:userid",
 withPrisma(async (req: Request, res: Response,prisma:any): Promise<any> => {
    let success = false;
    

    try {
      console.log("  - ", req.params.userid);
      const result = await prisma.leaderBoard.findMany()

      let no = 0;
      result.map((e: { participent: any[]; }) => {
        e.participent.map((k: { userid: string; solvedProblem: string | any[]; }) => {
          if (k.userid === req.params.userid) no += k.solvedProblem.length
        })
      })


      success = true;
      res.send({ success, msg: "Done", result: (1000 + no * 50) })
    } catch (error) {
      console.log(error);
      return res.status(500).send({ success, error });
    } 
  })
);




module.exports = router;
