import { Request, Response, Router } from "express";
import { body, validationResult } from "express-validator";
import { withPrisma } from "../../lib/prisma_callback";
const ServerUrl = process.env.ServerUrl || "http://localhost:8000"
console.log(ServerUrl);

const router = Router();
router.get("/", (req: Request, res: Response) => {
  res.send({ success: "Contest Problem Routing is on" });
});


router.post(
  "/create",
  [
    body("problemName", "Please Enter a problem name").exists(),
    body("description", "Please Enter a description ").exists(),
    body("testcases", "Please Enter a testcases").exists(),
    body("topic", "Please Enter a topic").exists(),
    body("sampleInputOutput", "Please Enter a sampleInputOutput").exists(),
    body("testcases", "Please Enter a testcases").exists(),
    body("constraint", "Please Enter a constraint").exists(),
    body("aboveCodeTemplate", "Please Enter a aboveCodeTemplate").exists(),
    body("middleCode", "Please Enter a middleCode").exists(),
    body("correctMiddleCode", "Please Enter a correctMiddleCode").exists(),
    body("belowCodeTemplate", "Please Enter a belowCodeTemplate").exists(),
    body("createdAt", "Please Enter a createdAt"),

  ],
  withPrisma(async (req: Request, res: Response,prisma:any): Promise<any> => {
    let success = false;
    

    try {
      let error = validationResult(req.body);
      if (!error.isEmpty()) {
        return res.status(404).send({ success, error: error.array() });
      }
      let date: any = null

      let {
        problemName,
        description,
        testcases,
        constraint,
        topic,
        sampleInputOutput,
        aboveCodeTemplate,
        belowCodeTemplate,
        middleCode,
        correctMiddleCode,
      } = req.body;
      console.log("topic-", topic);

      let t = await prisma.contestProblem.findMany();
      let newNumber = 1;
      if (t.length > 0) {
        console.log(t[t.length - 1].problemNo);
        newNumber = t[t.length - 1].problemNo + 1;
      }
      let result = await prisma.contestProblem.create({
        data: {
          problemNo: newNumber,
          problemName: problemName,
          description: description,
          topic: topic,
          testcases: testcases,
          constraint: constraint,
          sampleInputOutput: sampleInputOutput,
          aboveCodeTemplate: aboveCodeTemplate,
          belowCodeTemplate: belowCodeTemplate,
          middleCode: middleCode,
          correctMiddleCode: correctMiddleCode,
        },
      });

      console.log(result);

      success = true;
      return res.send({ success, body: req.body, msg: "Contest Problem Created" });
    } catch (error) {
      console.log(error);
      return res.status(500).send({ success, error });
    } 
  })
);




router.put(
  "/update/:problemno",
  [
    body("problemName", "Please Enter a problem name").exists(),
    body("description", "Please Enter a description ").exists(),
    body("topic", "Please Enter a topic").exists(),
    body("category", "Please Enter a category").exists(),
    body("testcase", "Please Enter a testcase").exists(),
    body("constraint", "Please Enter a constraint").exists(),
    body("sampleInputOutput", "Please Enter a sampleInputOutput").exists(),
    body("aboveCodeTemplate", "Please Enter a aboveCodeTemplate").exists(),
    body("belowCodeTemplate", "Please Enter a belowCodeTemplate").exists(),
    body("middleCode", "Please Enter a middleCode").exists(),
    body("correctMiddleCode", "Please Enter a correctMiddleCode").exists(),
  ],
  withPrisma(async (req: Request, res: Response,prisma:any): Promise<any> => {
    let success = false;
    

    try {
      let error = validationResult(req.body);
      if (!error.isEmpty()) {
        return res.status(404).send({ success, error: error.array() });
      }
      let query: any = {};
      if (req.body.problemName) {
        query.problemName = req.body.problemName
      }
      if (req.body.description) {
        query.description = req.body.description
      }


      if (req.body.testcases) {
        query.testcases = req.body.testcases
      }
      if (req.body.constraint) {
        query.constraint = req.body.constraint
      }
      if (req.body.topic) {
        query.topic = req.body.topic
      }

      if (req.body.sampleInputOutput) {
        query.sampleInputOutput = req.body.sampleInputOutput
      }
      if (req.body.aboveCodeTemplate) {
        query.aboveCodeTemplate = req.body.aboveCodeTemplate
      }
      if (req.body.belowCodeTemplate) {
        query.belowCodeTemplate = req.body.belowCodeTemplate
      }
      if (req.body.middleCode) {
        query.middleCode = req.body.middleCode
      }
      if (req.body.correctMiddleCode) {
        query.correctMiddleCode = req.body.correctMiddleCode
      }
      if (Object.keys(query).length === 0) {
        return res.send({ success, msg: "Empty Content" })
      }
      let result = await prisma.contestProblem.update({
        where: { problemNo: Number.parseInt(req.params.problemno) }, data: {
          ...query
        }
      })


      success = true;
      return res.send({ success, result, msg: "Update Successfull" });
    } catch (error) {
      console.log(error);
      return res.status(500).send({ success, error });
    } 
  })
);

router.delete(
  "/delete/:problemno",
  withPrisma(async (req: Request, res: Response,prisma:any): Promise<any> => {
    let success = false;
    

    try {
      let check1 = await prisma.contestProblem.findFirst({ where: { problemNo: Number.parseInt(req.params.problemno) } })
      if (!check1) {
        return res.send({ success, msg: "Contest Problem not Exist" })
      }

      let result = await prisma.contestProblem.delete({ where: { problemNo: Number.parseInt(req.params.problemno) } })
      // Update the problem numbers for the remaining problems
      await prisma.contestProblem.updateMany({
        where: {
          problemNo: {
            gt: Number.parseInt(req.params.problemno),
          },
        },
        data: {
          problemNo: {
            decrement: 1, // Decrease the problemNo for each problem after the deleted one
          },
        },
      });

      success = true;
      return res.send({ success, result, msg: "Contest Problem deleted" });
    } catch (error) {
      console.log(error);
      return res.status(500).send({ success, error });
    } 
  })
);

router.post(
  "/getallproblem", [
  body("id", "Please Enter a id"),
  body("problemName", "Please Enter a problem name"),
  body("description", "Please Enter a description "),
  body("testcase", "Please Enter a testcase"),
  body("constraint", "Please Enter a constraint"),
  body("topic", "Please Enter a topic"),
  body("sampleInputOutput", "Please Enter a sampleInputOutput"),
  body("aboveCodeTemplate", "Please Enter a aboveCodeTemplate"),
  body("belowCodeTemplate", "Please Enter a belowCodeTemplate"),
  body("middleCode", "Please Enter a middleCode"),
  body("correctMiddleCode", "Please Enter a correctMiddleCode")
],
  withPrisma(async (req: Request, res: Response,prisma:any): Promise<any> => {
    let success = false;
    

    try {
      let result = {};
      let query: any = {};
      if (req.body.id) {
        query.id = 1
      }
      if (req.body.problemName) {
        query.problemName = 1
      }
      if (req.body.problemNo) {
        query.problemNo = 1
      }
      if (req.body.description) {
        query.description = 1
      }
      if (req.body.testcases) {
        query.testcases = 1
      }
      if (req.body.constraint) {
        query.constraint = 1
      }
      if (req.body.topic) {
        query.topic = 1
      }

      if (req.body.category) {
        query.category = 1
      }

      if (req.body.correctMiddleCode) {
        query.correctMiddleCode = 1
      }
      if (req.body.sampleInputOutput) {
        query.sampleInputOutput = 1
      }
      if (req.body.aboveCodeTemplate) {
        query.aboveCodeTemplate = 1
      }
      if (req.body.belowCodeTemplate) {
        query.belowCodeTemplate = 1
      }
      if (req.body.middleCode) {
        query.middleCode = 1
      }

      if (!(Object.keys(query).length === 0))
        result = await prisma.contestProblem.findMany({ select: { ...query } })
      else
        result = await prisma.contestProblem.findMany()
      success = true;
      return res.send({ success, result });
    } catch (error) {
      console.log(error);
      return res.status(500).send({ success, error });
    } 
  })
);

router.post(
  "/getspecificproblem",
  withPrisma(async (req: Request, res: Response,prisma:any): Promise<any> => {
    let success = false;
    

    try {
      const { id, no } = req.query;
      if (!id && !no) {
        return res.send({ success, msg: "Please enter a valid id or no" })
      }
      console.log(id, "-----", no);
      let result: any;
      if (id) {
        result = await prisma.contestProblem.findFirst({ where: { id: (id as string) } })
        console.log("result--", result);

        if (result === null) {
          return res.send({ success, result });
        }
        const token = req.body.token || "";
        if (!token) {
          return res.status(400).send({ success: false, msg: "Token is required" });
        }

        const response = await fetch(`${ServerUrl}/api/user/tokentodata`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token: (token || "") })
        });
        console.log("final -", result);
      }
      if (no) {
        result = await prisma.contestProblem.findFirst({ where: { problemNo: Number.parseInt(no as string) } })
      }
      if (result === null) success = false;
      else success = true;

      return res.send({ success, result });
    } catch (error) {
      console.log(error);
      return res.status(500).send({ success, error });
    } 
  })
);

module.exports = router;
