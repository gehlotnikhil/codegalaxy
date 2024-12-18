import { Request, response, Response, Router } from "express";
import { PrismaClient } from "@prisma/client";
import { body, header, validationResult } from "express-validator";
import fetch from "node-fetch"
const router = Router();
const prisma = new PrismaClient();
const CLIENT_ID = "Ov23li1Ee2cnNpYQGRb5";
const CLIENT_SECRET = "00af1acbf8e95110f3ef48f5e6ecd562f5e5de3b";

router.get("/", (req: Request, res: Response) => {
  res.send({ success: "User Routing is on" });
});

// User Registration route
router.post(
  "/registeruser",
  [
    body("name", "Please Enter Your Name").exists(),
    body("age", "Please Enter Your Age").exists(),
    body("email", "Please Enter Your Email").exists(),
    body("email", "Enter Valid Email Format").isEmail(),
    body("password", "Please Enter Your Password").exists(),
    body("gender", "Please Enter Your Gender").exists(),
    body("userName", "Please Enter Your Username").exists(),
    body("collegeName", "Please Enter Your CollegeName").exists(),
    body("state", "Please Enter Your State").exists(),
    body("country", "Please Enter Your Country").exists(),
  ],
  async (req: Request, res: Response): Promise<any> => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).send({ error: errors.array() });
    }

    let success = false;
    try {
      const {
        name,
        age,
        email,
        password,
        gender,
        state,
        country,
        collegeName,
        userName,
      } = req.body;

      // Create the user in the database
      const result = await prisma.user.create({
        data: {
          name: name,
          age: age,
          email: email,
          password: password,
          gender: gender,
          state: state,
          country: country,
          collegeName: collegeName,
          userName: userName,
          totalRank: 1000,
          noOfProblemSolved: 0,
          solvedProblemDetails: [],
          noOfContestParticipated: 0,
          contestDetails: [],
        },
      });

      console.log("User created:", result);

      success = true;
      res.send({ success, user: result }); // Sending the user object as response
    } catch (error) {
      console.error("Error during user creation:", error);
      res.status(500).send({ success, error });
    }
  }
);

// GitHub OAuth Access Token Retrieval
router.get(
  "/getaccesstoken",
  async (req: Request, res: Response): Promise<any> => {
    const { code } = req.query;

    if (!code) {
      return res.status(400).send({ error: "Missing code query parameter" });
    }

    const params = new URLSearchParams({
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      code: code as string,
    });

    try {
      const response = await fetch(
        `https://github.com/login/oauth/access_token`,
        {
          method: "POST",
          headers: { Accept: "application/json" },
          body: params,
        }
      );
      
      const data = await response.json();
      
      if (data.error) {
        return res.status(400).send({ error: data.error_description });
      }
      
      console.log("f",data);
      res.send(data);
    } catch (error) {
      console.error("Error fetching access token:", error);
      res.status(500).send({ error: "Internal server error" });
    }
  }
);
router.get("/getuserdata", async (req: Request, res: Response):Promise<any> => {
  const authHeader = req.get("Authorization");

  if (!authHeader) {
    return res
      .status(400)
      .send({ error: "Authorization header is missing" });
  }

  try {
    const response = await fetch("https://api.github.com/user", {
      method: "GET",
      headers: {
        Authorization: authHeader,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("GitHub API Error:", errorData);
      return res
        .status(response.status)
        .send({ error: "Failed to fetch user data", details: errorData });
    }

    const data = await response.json();
    console.log("final-",data);
    
    res.json(data);
  } catch (error) {
    console.error("Error fetching GitHub user data:", error);
    res.status(500).send({ error: "Internal server error" });
  }
});
module.exports = router;
