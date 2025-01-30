import { Request, Response, Router } from "express";
import { body, validationResult } from "express-validator";
import executeproblem from "./ExecuteProblem";
import { PrismaClient } from "@prisma/client";
import axios from "axios";
const prisma = new PrismaClient();
const ServerUrl = process.env.ServerUrl || "http://localhost:8000"
console.log(ServerUrl);

const router = Router();
router.get("/", (req: Request, res: Response) => {
  res.send({ success: "ProblemSet Routing is on" });
});


router.post(
  "/create",
  [
    body("problemName", "Please Enter a problem name").exists(),
    body("description", "Please Enter a description ").exists(),
    body("companies", "Please Enter a companies ").exists(),
    body("like", "Please Enter a like ").exists(),
    body("dislike", "Please Enter a dislike").exists(),
    body("testcase", "Please Enter a testcase").exists(),
    body("constraint", "Please Enter a constraint").exists(),
    body("topic", "Please Enter a topic").exists(),
    body("accepted", "Please Enter a accepted").exists(),
    body("submission", "Please Enter a submission").exists(),
    body("status", "Please Enter a status").exists(),
    body("category", "Please Enter a category").exists(),
    body("sampleInputOutput", "Please Enter a sampleInputOutput").exists(),
    body("aboveCodeTemplate", "Please Enter a aboveCodeTemplate").exists(),
    body("middleCode", "Please Enter a middleCode").exists(),
    body("belowCodeTemplate", "Please Enter a belowCodeTemplate").exists(),

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
        companies,
        like,
        dislike,
        testcases,
        constraint,
        topic,
        accepted,
        submission,
        status,
        category,
        sampleInputOutput,
        aboveCodeTemplate,
        belowCodeTemplate,
        middleCode
      } = req.body;
      console.log("topic-", topic);

      let t = await prisma.problemSet.findMany();
      let newNumber = 1;
      if (t.length > 0) {
        console.log(t[t.length - 1].problemNo);
        newNumber = t[t.length - 1].problemNo + 1;
      }
      let result = await prisma.problemSet.create({
        data: {
          problemNo: newNumber,
          problemName: problemName,
          description: description,
          companies: companies,
          like: like,
          dislike: dislike,
          testcases: testcases,
          constraint: constraint,
          topic: topic,
          accepted: accepted,
          submission: submission,
          category: category,
          sampleInputOutput: sampleInputOutput,
          aboveCodeTemplate: aboveCodeTemplate,
          belowCodeTemplate: belowCodeTemplate,
          middleCode: middleCode,

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



router.post(
  "/createpraticeproblem",
  [
    body("problemName", "Please Enter a problem name").exists(),
    body("description", "Please Enter a description ").exists(),
    body("constraint", "Please Enter a constraint").exists(),
    body("language", "Please Enter a language").exists(),
    body("sampleInputOutput", "Please Enter a sampleInputOutput").exists(),
    body("testcase", "Please Enter a testcase").exists(),
    body("aboveCodeTemplate", "Please Enter a aboveCodeTemplate").exists(),
    body("middleCode", "Please Enter a middleCode").exists(),
    body("belowCodeTemplate", "Please Enter a belowCodeTemplate").exists(),

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
        constraint,
        language,
        sampleInputOutput,
        testcases,
        aboveCodeTemplate,
        belowCodeTemplate,
        middleCode
      } = req.body;

      let result = await prisma.praticeProblem.create({
        data: {
          problemName: problemName,
          description: description,
          testcases: testcases,
          constraint: constraint,
          language: language,
          sampleInputOutput: sampleInputOutput,
          aboveCodeTemplate: aboveCodeTemplate,
          belowCodeTemplate: belowCodeTemplate,
          middleCode: middleCode,

        },
      });
      console.log(result);
      success = true;
      return res.send({ success, body: req.body, msg: "Pratice Problem Created" });
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
    body("companies", "Please Enter a companies ").exists(),
    body("like", "Please Enter a like ").exists(),
    body("dislike", "Please Enter a dislike").exists(),
    body("testcase", "Please Enter a testcase").exists(),
    body("constraint", "Please Enter a constraint").exists(),
    body("topic", "Please Enter a topic").exists(),
    body("accepted", "Please Enter a accepted").exists(),
    body("category", "Please Enter a category").exists(),
    body("submission", "Please Enter a submission").exists(),
    body("status", "Please Enter a status").exists(),
    body("sampleInputOutput", "Please Enter a sampleInputOutput").exists(),
    body("aboveCodeTemplate", "Please Enter a aboveCodeTemplate").exists(),
    body("belowCodeTemplate", "Please Enter a belowCodeTemplate").exists(),
    body("middleCode", "Please Enter a middleCode").exists(),
  ],
  async (req: Request, res: Response): Promise<any> => {
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
      if (req.body.companies) {
        query.companies = req.body.companies
      }
      if (req.body.like) {
        query.like = req.body.like
      }
      if (req.body.dislike) {
        query.dislike = req.body.dislike
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
      if (req.body.accepted) {
        query.accepted = req.body.accepted
      }
      if (req.body.category) {
        query.category = req.body.category
      }
      if (req.body.submission) {
        query.submission = req.body.submission
      }
      if (req.body.status) {
        query.status = req.body.status
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
      if (Object.keys(query).length === 0) {
        return res.send({ success, msg: "Empty Content" })
      }
      let result = await prisma.problemSet.update({
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
  }
);

router.delete(
  "/delete/:problemno",
  async (req: Request, res: Response): Promise<any> => {
    let success = false;
    try {
      let check1 = await prisma.problemSet.findFirst({ where: { problemNo: Number.parseInt(req.params.problemno) } })
      if (!check1) {
        return res.send({ success, msg: "Problem not Exist" })
      }

      let result = await prisma.problemSet.delete({ where: { problemNo: Number.parseInt(req.params.problemno) } })
      // Update the problem numbers for the remaining problems
      await prisma.problemSet.updateMany({
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
      return res.send({ success, result, msg: "Problem deleted" });
    } catch (error) {
      console.log(error);
      return res.status(500).send({ success, error });
    }
  }
);

router.get(
  "/getallproblem/:pageno?",
  async (req: Request, res: Response): Promise<any> => {
    let success = false;
    try {
      console.log(req.params.pageno, "----", typeof req.params.pageno);
      if (req.params.pageno) {
        let result = await prisma.problemSet.findMany({
          skip: Number(req.params.pageno) === 0 ? 0 : (Number(req.params.pageno) - 1) * 10,
          take: 10
        });
        success = true;
        return res.send({ success, result });
      }

      let result = (await prisma.problemSet.findMany())
      success = true;
      return res.send({ success, result });
    } catch (error) {
      console.log(error);
      return res.status(500).send({ success, error });
    }
  }
);
// Get problem details
router.post("/getproblemdetails/:pageno?", async (req: Request, res: Response): Promise<any> => {
  let success = false;
  try {
    const { pageno } = req.params;
    const token = req.body.token;

    if (!token) {
      return res.status(400).send({ success, msg: "Token is required" });
    }

    const response = await axios.post(`${ServerUrl}/api/user/tokentodata`, { token: (token || "") }, {
      headers: { "Content-Type": "application/json" },
    });

    const data = response.data;
    console.log(data.success);
    console.log(data.result);
    if (!data.success) {
      return res.status(401).send({ success, msg: "Invalid token" });
    }

    if (!pageno) {
      return res.status(400).send({ success, msg: "Please provide a valid page number" });
    }

    const page = Number(pageno) || 1;
    const pageSize = 10;
    let result: any = await prisma.problemSet.findMany({
      skip: (page - 1) * pageSize,
      take: pageSize,
      select: {
        id: true,
        problemNo: true,
        problemName: true,
        accepted: true,
        submission: true,
        category: true,
        topic: true,
      },
    });
    const solvedProblemDetails = data.result.solvedProblemDetails

    result = result.map((value: any) => {
      const check = solvedProblemDetails.find(((v: any) => v === value.id))
      if (check) {
        value.status = "SOLVED";
      } else {
        value.status = "UNSOLVED";
      }
      return value
    })
    console.log("final -", result);

    const totalCount = await prisma.problemSet.count();
    success = true;
    return res.send({ success, result, totalCount });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ success, error: error });
  }
}
);
router.post("/getpraticeproblemdetails", async (req: Request, res: Response): Promise<any> => {
  try {
    const { token, language } = req.body;
    if (!token) {
      return res.status(400).json({ success: false, msg: "Token is required" });
    }

    const { data } = await axios.post(`${ServerUrl}/api/user/tokentodata`, { token }, {
      headers: { "Content-Type": "application/json" },
    });

    if (!data.success) {
      return res.status(401).json({ success: false, msg: "Invalid token" });
    }

    const allProblems = await prisma.praticeProblem.findMany({ select: { language: true } });
    const entireCount = allProblems.reduce((acc, { language }) => {
      acc[language] = (acc[language] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const problems = await prisma.praticeProblem.findMany({
      where: { language },
      select: { id: true, problemName: true, language: true },
    });

    const solvedProblems = new Set(data.result.praticeCourseDetail[language]?.solvedProblemDetails || []);
    const formattedProblems = problems.map((problem) => ({
      ...problem,
      status: solvedProblems.has(problem.id) ? "SOLVED" : "UNSOLVED",
    }));

    res.json({ success: true, result: formattedProblems, totalCount: formattedProblems.length, entireCount });
  } catch (error) {
    console.error("Error fetching practice problem details:", error);
    res.status(500).json({ success: false, error: (error as Error).message || "Internal Server Error" });
  }
});


router.post(
  "/getspecificproblem",
  async (req: Request, res: Response): Promise<any> => {
    let success = false;
    try {
      const { id, no } = req.query;
      if (!id && !no) {
        return res.send({ success, msg: "Please enter a valid id or no" })
      }
      console.log(id, "-----", no);
      let result: any;
      if (id) {
        result = await prisma.problemSet.findFirst({ where: { id: (id as string) } })
        console.log("result--", result);

        if (result === null) {
          return res.send({ success, result });
        }
        const token = req.body.token || "";
        if (!token) {
          return res.status(400).send({ success: false, msg: "Token is required" });
        }

        const response = await axios.post(`${ServerUrl}/api/user/tokentodata`, { token: (token || "") }, {
          headers: { "Content-Type": "application/json" },
        });

        if (!response.data.success) {
          return res.status(401).send({ success, msg: "Invalid token" });
        }
        const data = response.data;
        console.log("data-success:", data);
        console.log(data.result);

        const solvedProblemDetails = data.result.solvedProblemDetails
        const check = solvedProblemDetails.find((v: any) => v === result.id)
        console.log(solvedProblemDetails, "<---->", result.id)
        if (check) {
          result.status = "SOLVED";
        } else {
          result.status = "UNSOLVED";
        }

        console.log("final -", result);

      }
      if (no) {
        result = await prisma.problemSet.findFirst({ where: { problemNo: Number.parseInt(no as string) } })
      }
      if (result === null) {
        success = false;
      } else {
        success = true;

      }

      return res.send({ success, result });
    } catch (error) {
      console.log(error);
      return res.status(500).send({ success, error });
    }
  }
);

router.post(
  "/getspecificpraticeproblem",
  async (req: Request, res: Response): Promise<any> => {
    let success = false;
    try {
      const token = req.body.token || "";
      if (!token) {
        return res.status(400).send({ success: false, msg: "Token is required" });
      }
      const { id } = req.query;
      if (!id) {
        return res.send({ success, msg: "Please enter a valid id " })
      }
      console.log(id, "-----");
      let result: any = await prisma.praticeProblem.findFirst({ where: { id: (id as string) } })
      console.log("result--", result);

      if (result === null) {
        return res.send({ success, result });
      }
      const response = await axios.post(`${ServerUrl}/api/user/tokentodata`, { token: (token || "") }, {
        headers: { "Content-Type": "application/json" },
      });

      if (!response.data.success) {
        return res.status(401).send({ success, msg: "Invalid token" });
      }
      const data = response.data;
      console.log("data-success:", data);
      console.log(data.result);

      const solvedProblemDetails = data.result.praticeCourseDetail[`${result.language}`].solvedProblemDetails
      const check = solvedProblemDetails.find((v: any) => v === result.id)
      console.log(solvedProblemDetails, "<---->", result.id)
      if (check) {
        result.status = "SOLVED";
      } else {
        result.status = "UNSOLVED";
      }

      console.log("final -", result);



      if (result !== null) {
        success = true;
      }

      return res.send({ success, result });
    } catch (error) {
      console.log(error);
      return res.status(500).send({ success, error });
    }
  }
);

router.post("/executeproblem", [
  body("testcase", "Please enter a testcases").exists(),
  body("language", "Please enter a language").exists(),
  body("code", "Please enter a code").exists(),
], executeproblem.execute);

module.exports = router;
