import { getPrisma } from "../../lib/prisma.js"
const prisma = getPrisma();
import { Request, Response, Router } from "express";
import { body, validationResult } from "express-validator"
const router = Router();
const ServerUrl = process.env.ServerUrl || "http://localhost:8000"
console.log(ServerUrl);



router.get("/", (req: Request, res: Response) => {
  res.send({ success: "Daily New Problem Routing is on" });
});
router.post("/create", [
  body("problemName", "Please Enter a problem name").exists(),
  body("description", "Please Enter a description ").exists(),
  body("companies", "Please Enter a companies ").exists(),
  body("testcases", "Please Enter a testcase").exists(),
  body("constraint", "Please Enter a constraint").exists(),
  body("topic", "Please Enter a topic").exists(),
  body("category", "Please Enter a category").exists(),
  body("sampleInputOutput", "Please Enter a sampleInputOutput").exists(),
  body("aboveCodeTemplate", "Please Enter a aboveCodeTemplate").exists(),
  body("middleCode", "Please Enter a middleCode").exists(),
  body("correctMiddleCode", "Please Enter a correctMiddleCode").exists(),
  body("belowCodeTemplate", "Please Enter a belowCodeTemplate").exists(),


], async (req: Request, res: Response): Promise<any> => {
  let success = false
  try {
    let error = validationResult(req);
    if (!error.isEmpty()) {
      return res.status(404).send({ success, error: error.array(), msg: "Parameter missing" });
    }
    let {
      problemName,
      description,
      companies,
      testcases,
      constraint,
      topic,
      category,
      sampleInputOutput,
      aboveCodeTemplate,
      belowCodeTemplate,
      middleCode,
      correctMiddleCode
    } = req.body;
    console.log("topic-", topic);
    let t = await prisma.dailyNewProblem.findMany();
    let newNumber = 1;
    if (t.length > 0) {
      console.log(t[t.length - 1].problemNo);
      newNumber = t[t.length - 1].problemNo + 1;
    }

    let result = await prisma.dailyNewProblem.create({
      data: {
        problemNo: newNumber,
        problemName: problemName,
        description: description,
        companies: companies,
        testcases: testcases,
        constraint: constraint,
        topic: topic,
        category: category,
        sampleInputOutput: sampleInputOutput,
        aboveCodeTemplate: aboveCodeTemplate,
        belowCodeTemplate: belowCodeTemplate,
        middleCode: middleCode,
        correctMiddleCode: correctMiddleCode,


      },
    });


    success = true
    res.send({ success, msg: "Daily new problem created", result })

  } catch (error) {
    console.log(error);
    res.send({ success, msg: "Internal Server Error " })
  } finally {
    await prisma.$disconnect()
  }

})



router.delete(
  "/delete",
  async (req: Request, res: Response): Promise<any> => {
    let success = false;
    try {
      let result = await prisma.dailyNewProblem.findFirst({ where: { problemNo: 1 } })
      if (!result) {
        return res.send({ success, msg: "Daily new Problem not Exist" })
      }

      let resultD = await prisma.dailyNewProblem.deleteMany({
        where: { problemNo: 1 }
      });      // Update the problem numbers for the remaining problems
      await prisma.dailyNewProblem.updateMany({
        where: {
          problemNo: {
            gt: 1,
          },
        },
        data: {
          problemNo: {
            decrement: 1, // Decrease the problemNo for each problem after the deleted one
          },
        },
      });


      // console.log(result);

      let t2 = await prisma.problemSet.findMany();
      let newNumber2 = 1;
      if (t2.length > 0) {
        console.log(t2[t2.length - 1].problemNo);
        newNumber2 = t2[t2.length - 1].problemNo + 1;
      }
      let result2 = await prisma.problemSet.create({
        data: {
          problemNo: newNumber2,
          problemName: result?.problemName,
          description: result.description,
          companies: result.companies,
          Details: { like: [], dislike: [] },
          testcases: result.testcases,
          constraint: result.constraint,
          topic: result.topic,
          accepted: 0,
          submission: 0,
          category: result.category,
          sampleInputOutput: result.sampleInputOutput,
          aboveCodeTemplate: result.aboveCodeTemplate,
          belowCodeTemplate: result.belowCodeTemplate,
          middleCode: result.middleCode,
          correctMiddleCode: result.correctMiddleCode,

        },
      });
      console.log("done - ");
      console.log("done - ", result2);
      console.log("done - ", result2);
      console.log("done - ");






      success = true;
      return res.send({ success, result, msg: "Daily new Problem deleted" });
    } catch (error) {
      console.log(error);
      return res.status(500).send({ success, error, msg: "Internal Server Error" });
    } finally {
      await prisma.$disconnect()
    }
  }
);

module.exports = router;

router.post("/push", async (req: Request, res: Response): Promise<any> => {
  let success = false
  try {
    const getfirst = await prisma.dailyNewProblem.findFirst({ where: { problemNo: 1 } })
    if (!getfirst) {
      res.send({ success, msg: "Not able to create" })
    }
    if (getfirst) {
      let t = await prisma.problemSet.findMany();
      let newNumber = 1;
      if (t.length > 0) {
        console.log(t[t.length - 1].problemNo);
        newNumber = t[t.length - 1].problemNo + 1;
      }
      const response2 = await prisma.problemSet.create({
        data: {
          problemNo: newNumber,
          problemName: getfirst.problemName,
          description: getfirst.description,
          companies: getfirst.companies,
          Details: { like: [], dislike: [] },
          testcases: getfirst.testcases,
          constraint: getfirst.constraint,
          topic: getfirst.topic,
          accepted: 0,
          submission: 0,
          category: getfirst.category,
          sampleInputOutput: getfirst.sampleInputOutput,
          aboveCodeTemplate: getfirst.aboveCodeTemplate,
          belowCodeTemplate: getfirst.belowCodeTemplate,
          middleCode: getfirst.middleCode,
          correctMiddleCode: getfirst.correctMiddleCode,
        }
      })
      console.log("res2-", response2);

      success = true
      res.send({ success, msg: "Operation Done" })
    }
  } catch (error) {
    console.log(error);
    res.send({ success, msg: "Internal Server Error" })
  } finally {
    await prisma.$disconnect()
  }
})