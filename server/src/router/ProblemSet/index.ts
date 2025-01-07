import { Request, Response, Router } from "express";
import { body, validationResult } from "express-validator";
import executeproblem from "./ExecuteProblem";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const router = Router();
router.get("/", (req: Request, res: Response) => {
  res.send({ success: "ProblemSet Routing is on" });
});

router.post(
  "/create",
  [
    body("problemName", "Please Enter a problem name").exists(),
    body("description", "Please Enter a description ").exists(),
    body("timeComplexity", "Please Enter a timeComplexity ").exists(),
    body("spaceComplexity", "Please Enter a spaceComplexity ").exists(),
    body("companies", "Please Enter a companies ").exists(),
    body("like", "Please Enter a like ").exists(),
    body("dislike", "Please Enter a dislike").exists(),
    body("testcase", "Please Enter a testcase").exists(),
    body("constraint", "Please Enter a constraint").exists(),
    body("topic", "Please Enter a topic").exists(),
    body("accepted", "Please Enter a accepted").exists(),
    body("submission", "Please Enter a submission").exists(),
    body("status", "Please Enter a status").exists(),
    body("contestProblem", "Please Enter a contestProblem").exists(),
    body("sampleInputOutput", "Please Enter a sampleInputOutput").exists(),
  ],
  async (req: Request, res: Response): Promise<any> => {
    let success = false;

    try {
      let error = validationResult(req.body);
      if (!error.isEmpty()) {
        return res.status(404).send({ success, error: error.array() });
      }
      let {
        problemName,
        description,
        timeComplexity,
        spaceComplexity,
        companies,
        like,
        dislike,
        testcases,
        constraint,
        topic,
        accepted,
        submission,
        status,
        contestProblem,
        sampleInputOutput,
      } = req.body;
      let t = await prisma.contest.findMany();
      console.log(t[t.length-1].contestNo);
      let result = await prisma.problemSet.create({
        data: {
          problemNo: t[t.length-1].contestNo + 1,
          problemName: problemName,
          description: description,
          timeComplexity: timeComplexity,
          spaceComplexity: spaceComplexity,
          companies: companies,
          like: like,
          dislike: dislike,
          testcases: testcases,
          constraint: constraint,
          topic: topic,
          accepted: accepted,
          submission: submission,
          status: status,
          contestProblem: contestProblem,
          sampleInputOutput: sampleInputOutput,
        },
      });
      console.log(result);

      success = true;
      return res.send({ success, body: req.body, msg: "Problem Created" });
    } catch (error) {
      console.log(error);
      return res.status(500).send({ success, error });
    }
  }
);

router.put(
  "/update/:problemno",
  [
    body("problemName", "Please Enter a problem name").exists(),
    body("description", "Please Enter a description ").exists(),
    body("timeComplexity", "Please Enter a timeComplexity ").exists(),
    body("spaceComplexity", "Please Enter a spaceComplexity ").exists(),
    body("companies", "Please Enter a companies ").exists(),
    body("like", "Please Enter a like ").exists(),
    body("dislike", "Please Enter a dislike").exists(),
    body("testcase", "Please Enter a testcase").exists(),
    body("constraint", "Please Enter a constraint").exists(),
    body("topic", "Please Enter a topic").exists(),
    body("accepted", "Please Enter a accepted").exists(),
    body("submission", "Please Enter a submission").exists(),
    body("status", "Please Enter a status").exists(),
    body("contestProblem", "Please Enter a contestProblem").exists(),
    body("sampleInputOutput", "Please Enter a sampleInputOutput").exists(),
  ],
  async (req: Request, res: Response): Promise<any> => {
    let success = false;
    try {
      let error = validationResult(req.body);
      if (!error.isEmpty()) {
        return res.status(404).send({ success, error: error.array() });
      }
      let query:any={};
      if (req.body.problemName) {
      query.problemName=req.body.problemName
      }
      if (req.body.description) {
      query.description=req.body.description

      }
      if (req.body.timeComplexity) {
      query.timeComplexity=req.body.timeComplexity

      }
      if (req.body.spaceComplexity) {
      query.spaceComplexity=req.body.spaceComplexity

      }
      if (req.body.companies) {
      query.companies=req.body.companies

      }
      if (req.body.like) {
      query.like=req.body.like

      }
      if (req.body.dislike) {
      query.dislike=req.body.dislike

      }
      if (req.body.testcases) {
      query.testcases=req.body.testcases

      }
      if (req.body.constraint) {
      query.constraint=req.body.constraint

      }
      if (req.body.topic) {
      query.topic=req.body.topic

      }
      if (req.body.accepted) {
      query.accepted=req.body.accepted

      }
      if (req.body.submission) {
      query.submission=req.body.submission

      }
      if (req.body.status) {
      query.status=req.body.status

      }
      if (req.body.contestProblem) {
      query.contestProblem=req.body.contestProblem

      }
      if (req.body.sampleInputOutput) {
      query.sampleInputOutput=req.body.sampleInputOutput

      }
      if(Object.keys(query).length===0){
        return res.send({success,msg:"Empty Content"})
      }
      let result = await prisma.problemSet.update({where:{problemNo:Number.parseInt(req.params.problemno)},data:{
        ...query
      }})
      

      success = true;
      return res.send({ success ,result,msg:"Update Successfull"});
    } catch (error) {
      console.log(error);
      return res.status(500).send({ success, error });
    }
  }
);

router.delete(
  "/delete/:problemno",
  async (req: Request, res: Response): Promise<any> => {
    let success = false;
    try {
      let check1 = await prisma.problemSet.findFirst({where:{problemNo:Number.parseInt(req.params.problemno)}})
      if(!check1){
        return res.send({success,msg:"Problem not Exist"})
      }

      let result = await prisma.problemSet.delete({where:{problemNo:Number.parseInt(req.params.problemno)}})

      success = true;
      return res.send({ success,result,msg:"Problem deleted" });
    } catch (error) {
      console.log(error);
      return res.status(500).send({ success, error });
    }
  }
);

router.get(
  "/getallproblem",
  async (req: Request, res: Response): Promise<any> => {
    let success = false;
    try {
      let result = await prisma.problemSet.findMany()
      success = true;
      return res.send({ success,result });
    } catch (error) {
      console.log(error);
      return res.status(500).send({ success, error });
    }
  }
);

router.get(
  "/getspecificproblem/:problemno",
  async (req: Request, res: Response): Promise<any> => {
    let success = false;
    try {
      let result = await prisma.problemSet.findFirst({where:{problemNo:Number.parseInt(req.params.problemno)}})
      success = true;
      return res.send({ success,result });
    } catch (error) {
      console.log(error);
      return res.status(500).send({ success, error });
    }
  }
);

router.post("/executeproblem", [
  body("problemNo","Please enter a problemNo").exists(),
  body("testcase","Please enter a testcases").exists(),
  body("language","Please enter a language").exists(),
  body("code","Please enter a code").exists(),
], executeproblem.execute);

module.exports = router;
