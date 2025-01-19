import { Request, Response, Router } from "express";
import { PrismaClient } from "@prisma/client";
import { body, validationResult } from "express-validator";
import UserFunctions from "../lib/UserFunctions";
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const router = Router();
const axios = require("axios");
  const ServerUrl = process.env.ServerUrl||"http://localhost:8000"
  console.log(ServerUrl);
  
import GoogleLogin from "./GoogleLogin";

const prisma = new PrismaClient();
import { faker } from "@faker-js/faker";

function generateRandomName() {
  // Generate a random name using faker
  const firstName = faker.person.firstName(); // Random first name
  const lastName = faker.person.lastName(); // Random last name

  return `${firstName} ${lastName}`;
}
router.get("/", (req: Request, res: Response) => {
  res.send({ success: "User Routing is on" });
});
let JWT_Secret = "Nikhil123";

// User Registration route
router.post(
  "/registeruser",
  [
    body("email", "Please Enter Your Email").exists(),
    body("email", "Enter Valid Email Format").isEmail(),
    body("password", "Please Enter Your Password").exists(),
    body("userName", "Please Enter Your Username").exists(),
  ],
  async (req: Request, res: Response): Promise<any> => {
    let success = false;
    try {
      const { email, password, userName } = req.body;

      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).send({ success, error: errors.array() });
      }
      // check User Exist or not
      let check1 = await UserFunctions.isUserExist(email);
      if (check1) {
        return res.send({ success, msg: "User Already Exist" });
      }
      //Main Logic
      //encrypt the password
      let salt = await bcrypt.genSalt(10);
      let hashPassword = await bcrypt.hash(password, salt);
      let name: string = generateRandomName();

      // Create the user in the database
      const result = await prisma.user.create({
        data: {
          name: name,
          email: email,
          password: hashPassword,
          userName: userName,
          solvedProblemDetails: [],
          googleLoginAccess: false,
          isAdmin: false,
          profilePictureUrl:
            "https://res.cloudinary.com/diqpelkm9/image/upload/f_auto,q_auto/k4s9mgdywuaasjuthfxk",
        },
      });
      //create access token
      let data = {
        id: result.id,
      };
      let token = jwt.sign(data, JWT_Secret);

      console.log("User created:", result);

      success = true;
      
      res.send({ success, result:{...result,token:token} }); // Sending the user object as response
    } catch (error) {
      console.error("Error during user creation:", error);
      res.status(500).send({ success, error });
    }
  }
);

router.put(
  "/update/",
  [
    body("token", "Please fill the token field").exists(),
    body("name", "Please fill Name field").exists(),
    body("age", "Please fill age field").exists(),
    body("email", "Please fill email field").exists(),
    body("password", "Please fill password field").exists(),
    body("userName", "Please fill userName field").exists(),
    body(
      "solvedProblemDetails",
      "Please fill solvedProblemDetails field"
    ).exists(),
    body("gender", "Please fill gender field").exists(),
    body("collegeName", "Please fill collegeName field").exists(),
    body("state", "Please fill state field").exists(),
    body("country", "Please fill country field").exists(),
    body("role", "Please fill role field").exists(),
    body("googleLoginAccess", "Please fill googleLoginAccess field").exists(),
    body("profilePictureUrl", "Please fill profilePictureUrl field").exists(),
  ],
  async (req: Request, res: Response): Promise<any> => {
    let success = false;
    try {
      const response = await axios.post(
        `${ServerUrl}/api/user/tokentodata`,
        { token: req.body.token },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const userDetails = response.data;
      if (userDetails.success === false) {
        return res.send({
          success,
          msg: "Failed to Update because of internal isssue",
        });
      }
      console.log(userDetails);

      let error = validationResult(req.body);
      if (!error.isEmpty()) {
        return res.status(404).send({ success, error: error.array() });
      }
      let query: any = {};
      if (req.body.name) {
        query.name = req.body.name;
      }
      if (req.body.age) {
        query.age =  Number(req.body.age);
      }
      if (req.body.email) {
        query.email = req.body.email;
      }
      if (req.body.userName) {
        query.userName = req.body.userName;
      }
      if (req.body.solvedProblemDetails) {
        query.solvedProblemDetails = req.body.solvedProblemDetails;
      }
   
      if (req.body.gender) {
        query.gender = req.body.gender;
      }
      if (req.body.collegeName) {
        query.collegeName = req.body.collegeName;
      }
      if (req.body.country) {
        query.country = req.body.country;
      }
      if (req.body.state) {
        query.state = req.body.state;
      }
      if (req.body.isAdmin) {
        query.isAdmin = req.body.isAdmin;
      }
      if (req.body.googleLoginAccess) {
        query.googleLoginAccess = req.body.googleLoginAccess;
      }
      if (req.body.password) {
        let salt = await bcrypt.genSalt(10);
        console.log("-------password-",req.body.password);
        
        let hashPassword = await bcrypt.hash(req.body.password, salt);
        query.password = hashPassword;
      }

      if (req.body.profilePictureUrl) {
        query.profilePictureUrl = req.body.profilePictureUrl;
      }
      if (Object.keys(query).length === 0) {
        return res.send({ success, msg: "Empty Content" });
      }
      console.log({...query});
      console.log("id-", userDetails.result.id);
      
      let result = await prisma.user.update({
        where: { id: userDetails.result.id },
        data: {
          ...query,
        },
      });

      success = true;
    return  res.send({ success, result:{...result,token:req.body.token} }); // Sending the user object as response
    } catch (error) {
      console.log(error);
      return res.status(500).send({ success, error });
    }
  }
);

router.post(
  "/login",
  [
    body("email", "Please neter your email").exists(),
    body("password", "Please enter your password"),
  ],
  async (req: Request, res: Response): Promise<any> => {
    let success = false;
    try {
      console.log("1");
      console.log("1");
      console.log("1");
      console.log("1");
      
      let error = validationResult(req.body);
      if (!error.isEmpty) {
        return res.status(404).send({ success, error: error.array() });
      }
      let { email, password } = req.body;
      console.log("2");
      console.log(email,"---",password);
      
      let check1 = await UserFunctions.isUserExist(email);
      console.log("check1-",check1);
      
      if (!check1) {
        return res.send({ success, msg: "User Not Exist" });
      }
      console.log("c1");
      
      let u1 = await prisma.user.findFirst({ where: { email } });
      console.log("c2-",u1);
      console.log("u1-",password,"---",u1?.password);
      console.log("c3");
      let result = await bcrypt.compare(password, u1?.password);
      console.log("c4");
      console.log("final-",result);
      console.log("c5");
      
      if (!result) {
        return res.status(404).send({ success, msg: "Password is Incorrect" });
      }
      let data = {
        id: u1?.id,
      };
      console.log("c6");
      let token = await jwt.sign(data, JWT_Secret);
      success = true;
   return   res.send({ success, result:{...u1,token:token} }); // Sending the user object as response
    } catch (error) {
      console.log(error);
      res.status(500).send({ success, error });
    }
  }
);

router.get(
  "/getspecificuser",
  [
    body("email", "Please enter your email").exists(),
    body("email", "Please enter correct email format").isEmail(),
  ],
  async (req: Request, res: Response): Promise<any> => {
    let success = false;
    try {
      let error = validationResult(req.body);
      if (!error.isEmpty()) {
        return res.status(404).send({ success, error: error.array() });
      }
      let { email } = req.body;
      let check1 = await UserFunctions.isUserExist(email);
      if (!check1) {
        return res.status(404).send({ success, msg: "User not Exist" });
      }
      let result = await prisma.user.findFirst({ where: { email } });
      success = true;
      return res.send({ success, result });
    } catch (error) {
      console.log(error);
      return res.status(505).send({ success, error });
    }
  }
);

router.get("/getalluser", async (req: Request, res: Response): Promise<any> => {
  let success = false;
  try {
    let result = await prisma.user.findMany();
    success = true;
    return res.send({ success, result });
  } catch (error) {
    console.log(error);
    return res.status(505).send({ success, error });
  }
});

router.post(
  "/tokentodata",
  [body("token", "Please enter a token").exists()],
  async (req: Request, res: Response): Promise<any> => {
    let success = false;
    try {
      let error = validationResult(req.body);
      if (!error.isEmpty()) {
        return res.status(404).send({ success, error: error.array() });
      }
      let { token } = req.body;
      let decode = await jwt.decode(token);
      console.log("token - ", token);
      console.log("decode-", decode);
      let id = decode.id;
      console.log(id);

      let result = await prisma.user.findFirst({ where: { id } });
      console.log("res-", result);
      
      success = true;
      return res.send({ success, result });
    } catch (error) {
      console.log(error);
      return res.status(500).send({ success, error });
    }
  }
);

router.post(
  "/usernametodata",
  [body("userName", "Please enter a username").exists()],
  async (req: Request, res: Response): Promise<any> => {
    let success = false;
    try {
      let error = validationResult(req.body);
      if (!error.isEmpty()) {
        return res.status(404).send({ success, error: error.array() });
      }
      let { userName } = req.body;
      console.log("u-", userName);

      let result = await prisma.user.findFirst({ where: { userName } });
      console.log("res-", result);
      if (!result) {
        return res.send({ success, msg: "Username not exist" });
      }
      success = true;
      return res.send({ success, result });
    } catch (error) {
      console.log(error);
      return res.status(500).send({ success, error });
    }
  }
);

router.post("/googlelogin", GoogleLogin.googleLogin);

module.exports = router;
