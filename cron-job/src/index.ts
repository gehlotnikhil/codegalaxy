const dotenv = require("dotenv");
dotenv.config();
import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { body, validationResult } from "express-validator"
// Initialize environment variables and Prisma client
const prisma = new PrismaClient();
const cron = require("node-cron");
// Schedule the job to run at 12:00 AM daily
const CronJobUrl1 = process.env.CronJobUrl1 || "http://localhost:8001"
const express = require("express")
const app = express()
const PORT = process.env.PORT || 8001
app.use(express.json())
app.listen(PORT, () => {
  console.log("server running at", PORT);
})
app.get("/", (req: any, res: any) => {
  res.send({ success: true })
})


app.get("/abc",(req:any,res:any)=>{
  res.send({success:true,msg:"Hello"})
}) 

app.post("/create", [
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


  }

})

app.get("/push", async (req: Request, res: Response): Promise<any> => {
  let success = false;
  try {
    let result = await apiFetch(`${CronJobUrl1}/delete`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })

    let response = await result.json()
    console.log(response);

    success = true;
    res.send("Yes")
  } catch (error) {
    console.log(error)
    res.send("No")
  }

})


app.get(
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
    }
  }
);
