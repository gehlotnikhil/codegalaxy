import { Request, Response, Router } from "express";
import { PrismaClient } from "@prisma/client";
import { body, validationResult } from "express-validator";
import UserFunctions from "../lib/UserFunctions";
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const router = Router();
import GoogleLogin from "./GoogleLogin"; 
const prisma = new PrismaClient();

router.get("/", (req: Request, res: Response) => {
  res.send({ success: "User Routing is on" });
});
let JWT_Secret = "Nikhil123"

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

      // Create the user in the database
      const result = await prisma.user.create({
        data: {
          name: name,
          age: age,
          email: email,
          password: hashPassword,
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
          googleLoginAccess: false,
          role: { User: true, Admin: false },
        },
      });
      //create access token
      let data = {
        id: result.id,
      };
      let token = jwt.sign(data, JWT_Secret);

      console.log("User created:", result);

      success = true;
      res.send({ success, user: result, token }); // Sending the user object as response
    } catch (error) {
      console.error("Error during user creation:", error);
      res.status(500).send({ success, error });
    }
  }
);
router.get(
  "/login",
  [
    body("email","Please neter your email").exists(),
    body("password","Please enter your password")
  ],
  async (req: Request, res: Response): Promise<any> => {
    let success = false
    try {
      let error = validationResult(req.body)
      if(!error.isEmpty){
        return res.status(404).send({success,error:error.array()})
      }
      let {email,password} = req.body
      let check1 = await UserFunctions.isUserExist(email)
      if(!check1){
        return res.send({success,msg:"User Not Exist"})
      }
      let u1 = await prisma.user.findFirst({where:{email}})
      let result = await bcrypt.compare(password,u1?.password)
      if(!result){
        return res.status(404).send({success,msg:"Password is Incorrect"})
      }
      let data = {
        id:u1?.id
      }
      let token  = await jwt.sign(data,JWT_Secret)
      success = true
      return res.send({success,token})
    } catch (error) {
      console.log(error);
      res.status(500).send({success,error})
      
    }

  }
);

router.get("/getspecificuser",[
  body("email","Please enter your email").exists(),
  body("email","Please enter correct email format").isEmail(),
   
],async(req:Request,res:Response):Promise<any>=>{
  let success = false
  try {
    let error = validationResult(req.body)
    if(!error.isEmpty()){
      return res.status(404).send({success,error:error.array()})
    }
    let {email} = req.body
    let check1 = await UserFunctions.isUserExist(email);
    if(!check1){
      return res.status(404).send({success,msg:"User not Exist"})
    }
    let result = await prisma.user.findFirst({where:{email}})
    success=true
    return res.send({success,result})
  } catch (error) {
    console.log(error);
    return res.status(505).send({success,error})   
  }
})

router.get("/getalluser",async(req:Request,res:Response):Promise<any>=>{
  let success = false
  try {
    let result = await prisma.user.findMany()
    success=true
    return res.send({success,result})
  } catch (error) {
    console.log(error);
    return res.status(505).send({success,error})   
  }
})

router.get("/tokentodata",[
  body("token","Please enter a token").exists()
],async(req:Request,res:Response):Promise<any>=>{
  let success = false
  try {
    let error = validationResult(req.body)
    if(!error.isEmpty()){
      return res.status(404).send({success,error:error.array()})
    }
    let {token} = req.body
    let decode = await jwt.decode(token)
    console.log("token - ",token);
    console.log("decode-",decode);
    let id = decode.id
    console.log(id);
    
    let result = await prisma.user.findFirst({where:{id}})
    success = true
    return res.send({success,result})
  } catch (error) {
    console.log(error);
    return res.status(500).send({success,error})
    
    
  }
})

router.get("/usernametodata",[
  body("userName","Please enter a username").exists()
],async(req:Request,res:Response):Promise<any>=>{
  let success = false
  try {
    let error = validationResult(req.body)
    if(!error.isEmpty()){
      return res.status(404).send({success,error:error.array()})
    }
    let {userName} = req.body
    console.log("u-",userName);
    
    let result = await prisma.user.findFirst({where:{userName}})
    console.log("res-",result);
    if(!result){
      return res.send({success,msg:"Username name exist"})
    }
    success = true
    return res.send({success,result})
  } catch (error) {
    console.log(error);
    return res.status(500).send({success,error})
  }
    
})

router.post("/googlelogin", GoogleLogin.googleLogin);

module.exports = router;
