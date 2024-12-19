import { Request, Response, Router } from "express";
import { PrismaClient } from "@prisma/client";
import { body, validationResult } from "express-validator";
const router = Router();
import GoogleLogin from "./GoogleLogin";
const prisma = new PrismaClient();

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
          googleLoginAccess:false,
          role: {User:true,Admin:false}

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
router.post("/googlelogin",GoogleLogin.googleLogin)



module.exports = router;
