import { Request, Response, Router } from "express";
import { PrismaClient } from "@prisma/client";
import { body, Result, validationResult } from "express-validator";
import UserFunctions from "../lib/UserFunctions";
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const router = Router();
import sendEmail from "./sendEmail";



const ServerUrl = process.env.ServerUrl || "http://localhost:8000"
console.log(ServerUrl);

import ThirdPartyLogin from "./ThirdPartyLogin";
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


import { google } from "googleapis";
import nodemailer from "nodemailer";

function generateOTP(length: number = 6): string {
  return Math.floor(100000 + Math.random() * 900000).toString(); // Generates a 6-digit OTP
}

// User Registration route
router.post(
  "/registeruser",
  [
    body("name", "Please Enter Your name").exists(),
    body("age", "Please Enter Your age").exists(),
    body("collegeName", "Please Enter Your collegeName").exists(),
    body("email", "Please Enter Your Email").exists(),
    body("email", "Enter Valid Email Format").isEmail(),
    body("password", "Please Enter Your Password").exists(),
    body("userName", "Please Enter Your Username").exists(),
  ],
  async (req: Request, res: Response): Promise<any> => {
    let success = false;
    const otp = generateOTP(); // Generate OTP
    console.log(`Generated OTP: ${otp}`);
    try {
      const { email, password, userName, name, age, collegeName } = req.body;

      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).send({ success, error: errors.array(), msg: "Parameter missing" });
      }
      // check User Exist or not
      let check1 = await UserFunctions.isUserExist(email);
      if (check1) {
        return res.send({ success, msg: "User Already Exist" });
      }
      let check2 = await UserFunctions.isUserNameExist(userName);
      if (check2) {
        return res.send({ success, msg: "UserName Already Exist" });
      }




      //Main Logic
      //encrypt the password
      let salt = await bcrypt.genSalt(10);
      let hashPassword = await bcrypt.hash(password, salt);




      console.log(process.env.CLIENT_ID);
      console.log(process.env.CLIENT_SECRET);
      console.log(process.env.REFRESH_TOKEN);
      console.log("1");

      const OAuth2 = google.auth.OAuth2;
      console.log("2");

      const oauth2Client = new OAuth2(
        process.env.CLIENT_ID,
        process.env.CLIENT_SECRET,
        "https://developers.google.com/oauthplayground"
      );
      console.log("3");

      oauth2Client.setCredentials({
        refresh_token: process.env.REFRESH_TOKEN,
      });
      console.log("4");
      const accessToken = await oauth2Client.getAccessToken();
      console.log("5");
      console.log("access token - ", accessToken.token as string);
      console.log("6");

      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          type: "OAuth2",
          user: process.env.EMAIL,
          clientId: process.env.CLIENT_ID,
          clientSecret: process.env.CLIENT_SECRET,
          refreshToken: process.env.REFRESH_TOKEN,
          accessToken: accessToken.token as string,
        },
      });

      console.log("7");
      const mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: "CodeGalaxy Account OTP Code",
        html: `
                 <div style="font-family: Arial, sans-serif; padding: 20px;">
                <h2 style="color: #000;">CodeGalaxy account</h2>
                <h1 style="color: #0078D4;">OTP code</h1>
                <p>Please use the following OTP code for your CodeGalaxy account:</p>
                <h2 style="background-color: #f3f3f3; padding: 10px; display: inline-block; border-radius: 5px;">
                  ${otp}
                </h2>
                <p>If you don’t recognize this request, you can ignore this email.</p>
                <p>Thanks, <br> The CodeGalaxy account team</p>
              </div>
                `,
      };
      transporter.sendMail(mailOptions, async (err, info) => {
        if (err) {
          console.error("Error:", err);
          res.send({ success, msg: "Internal server Error" })
        }
        else {
          console.log("Email sent-:", info.response);
          // Delete Previous OTP Data if exist
          const r = await prisma.emailOtpService.deleteMany({ where: { email } })


          const result = await prisma.emailOtpService.create({
            data: {
              name: name,
              age: age,
              collegeName: collegeName,
              email: email,
              password: hashPassword,
              userName: userName,
              code: Number(otp)
            },
          });
          const date = new Date(result.createdAt);

          const seconds = date.getUTCHours() * 3600 + date.getUTCMinutes() * 60 + date.getUTCSeconds() + date.getUTCMilliseconds() / 1000;

          console.log(result.createdAt);
          console.log((Date.now() - new Date(result.createdAt).getTime()) / (1000));
          console.log((Date.now(), " ", new Date(result.createdAt).getTime()));
          console.log(Math.floor((Date.now(), " ", new Date(result.createdAt).getTime())) / (1000 * 60));

          console.log("OTP Sended:", result);

          success = true;
          res.send({ success, result: { ...result }, msg: "OTP Sended" }); // Sending the user object as response
        }
      });

    } catch (error) {
      console.error("Error during otp operation:", error);
      res.status(500).send({ success, error, msg: "Internal Server Error-" });
    }
  }
);




router.post(
  "/resendotpcode",
  [
    body("email", "Please Enter Your email").exists(),
  ],
  async (req: Request, res: Response): Promise<any> => {
    let success = false;

    try {
      const { email } = req.body;
      console.log("resend code -- -  ", email);

      const result1 = await prisma.emailOtpService.findFirst({ where: { email } })
      if (!result1) {
        return res.send({ success, msg: "Register Again..." })
      }
      await prisma.emailOtpService.deleteMany({ where: { email } })

      const response = await fetch(
        `${ServerUrl}/api/user/registeruser`,
        
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body:JSON.stringify({
            email: email,
            password: result1.password,
            userName: result1.userName,
            name: result1.name,
            collegeName: result1.collegeName,
            age: result1.age
          })
        }
      );
      const getresult = await response.json()
      if (!getresult.success) {
        return res.send({ success, msg: "Internal Server Error in Creating OTP" })
      }
      const data = getresult.result;

      console.log(data);

      success = true;
      return res.send({ success, msg: "Resend Code", result: data }); // Sending the user object as response

    } catch (error) {
      console.error("Error during user creation:", error);
      return res.status(500).send({ success, error, msg: "Internal Server Error" });
    }
  }
);






router.post(
  "/verify",
  [
    body("code", "Please Enter Your OTP Code").exists(),
    body("verifyemail", "Please Enter Your email").exists(),
  ],
  async (req: Request, res: Response): Promise<any> => {
    let success = false;

    try {
      const { code, verifyemail } = req.body;

      // Check for validation errors

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).send({ success, error: errors.array(), msg: "Missing Parameter" });
      }

      let name: string = generateRandomName();

      const r = await prisma.emailOtpService.findFirst({ where: { code: code, email: verifyemail } })
      console.log("hh----", r)
      // if code not found
      if (!r) {
        return res.send({ success, msg: "Incorrect OTP" })
      }
      console.log(r?.createdAt);

      console.log(Math.abs(Date.now() - new Date(r?.createdAt || "2025-02-03T16:30:00").getTime()) / 1000);
      // delete otp   

      if ((Math.abs(Date.now() - new Date(r?.createdAt || "2025-02-03T16:30:00").getTime()) / 1000) > 60) {
        return res.send({ success, msg: "OTP is Expired" })
      }
      else if (r && r.email && r.password && r.userName) {
        const k = await prisma.emailOtpService.deleteMany({ where: { code, email: verifyemail } })
        // creating user
        const result = await prisma.user.create({
          data: {
            name: r.name,
            age: r.age,
            collegeName: r.collegeName,
            email: r.email,
            password: r.password,
            userName: r.userName,
            totalRank: 1000,
            linkedin_url: null,
            solvedProblemDetails: [],
            activeDays: [],

            ThirdPartyLoginAccess: false,
            isAdmin: false,
            profilePictureUrl:
              "https://res.cloudinary.com/diqpelkm9/image/upload/f_auto,q_auto/k4s9mgdywuaasjuthfxk",
            praticeCourseDetail: {
              c: {
                solvedProblemDetails: [],
                participated: false,
                review: 0
              },
              cpp: {
                solvedProblemDetails: [],
                participated: false,
                review: 0
              },
              java: {
                solvedProblemDetails: [],
                participated: false,
                review: 0
              },
              go: {
                solvedProblemDetails: [],
                participated: false,
                review: 0
              },
            }
          },
        });
        //create access token
        let data = {
          id: result.id,
        };
        let token = jwt.sign(data, JWT_Secret);
        console.log("User created:", result);
        success = true;
        return res.send({ success, result: { ...result, token: token } }); // Sending the user object as response
      }
    } catch (error) {
      console.error("Error during user creation:", error);
      return res.status(500).send({ success, error });
    }
  }
);
// router.post(
//   "/registeruser",
//   [
//     body("email", "Please Enter Your Email").exists(),
//     body("email", "Enter Valid Email Format").isEmail(),
//     body("password", "Please Enter Your Password").exists(),
//     body("userName", "Please Enter Your Username").exists(),
//   ],
//   async (req: Request, res: Response): Promise<any> => {
//     let success = false;
//     try {
//       const { email, password, userName } = req.body;

//       // Check for validation errors
//       const errors = validationResult(req);
//       if (!errors.isEmpty()) {
//         return res.status(400).send({ success, error: errors.array() });
//       }
//       // check User Exist or not
//       let check1 = await UserFunctions.isUserExist(email);
//       if (check1) {
//         return res.send({ success, msg: "User Already Exist" });
//       }
//       //Main Logic
//       //encrypt the password
//       let salt = await bcrypt.genSalt(10);
//       let hashPassword = await bcrypt.hash(password, salt);
//       let name: string = generateRandomName();

//       // Create the user in the database



//       const result = await prisma.user.create({
//         data: {
//           name: name,
//           email: email,
//           password: hashPassword,
//           userName: userName,
//           totalRank: 1000,
//           solvedProblemDetails: [],
//           activeDays:[],

//           ThirdPartyLoginAccess: false,
//           isAdmin: false,
//           profilePictureUrl:
//             "https://res.cloudinary.com/diqpelkm9/image/upload/f_auto,q_auto/k4s9mgdywuaasjuthfxk",
//           praticeCourseDetail: {
//             c: {
//               solvedProblemDetails: [],
//               participated:false,
//               review:0
//             },
//             cpp: {
//               solvedProblemDetails: [],
//               participated:false,
//               review:0
//             },
//             java: {
//               solvedProblemDetails: [],
//               participated:false,
//               review:0
//             },
//             go: {
//               solvedProblemDetails: [],
//               participated:false,
//               review:0
//             },
//           }
//         },
//       });
//       //create access token
//       let data = {
//         id: result.id,
//       };
//       let token = jwt.sign(data, JWT_Secret);

//       console.log("User created:", result);

//       success = true;

//       res.send({ success, result: { ...result, token: token } }); // Sending the user object as response
//     } catch (error) {
//       console.error("Error during user creation:", error);
//       res.status(500).send({ success, error });
//     }
//   }
// );

router.put(
  "/update/",
  [
    body("token", "Please fill the token field").exists(),
    body("name", "Please fill Name field").exists(),
    body("age", "Please fill age field").exists(),
    body("email", "Please fill email field").exists(),
    body("password", "Please fill password field").exists(),
    body("linkedin_url", "Please fill linkedin_url field").exists(),
    body("userName", "Please fill userName field").exists(),
    body("totalRank", "Please fill totalRank field").exists(),
    body("noOfProblemSolved", "Please fill noOfProblemSolved field").exists(),
    body(
      "solvedProblemDetails",
      "Please fill solvedProblemDetails field"
    ).exists(),
    body(
      "noOfContestParticipated",
      "Please fill noOfContestParticipated field"
    ).exists(),
    body("contestDetails", "Please fill contestDetails field").exists(),
    body("gender", "Please fill gender field").exists(),
    body("collegeName", "Please fill collegeName field").exists(),
    body("state", "Please fill state field").exists(),
    body("country", "Please fill country field").exists(),
    body("role", "Please fill role field").exists(),
    body("ThirdPartyLoginAccess", "Please fill ThirdPartyLoginAccess field").exists(),
    body("profilePictureUrl", "Please fill profilePictureUrl field").exists(),
    body("activeDays", "Please fill activeDays field").exists(),
  ],
  async (req: Request, res: Response): Promise<any> => {
    let success = false;
    try {
      const response = await fetch(
        `${ServerUrl}/api/user/tokentodata`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token: req.body.token })
        }
      );

      const userDetails = await response.json();
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
        query.age = Number(req.body.age);
      }
      if (req.body.activeDays) {
        query.activeDays = req.body.activeDays;
      }
      if (req.body.email) {
        query.email = req.body.email;
      }
      if (req.body.userName) {
        query.userName = req.body.userName;
      }
      if (req.body.totalRank) {
        query.totalRank = req.body.totalRank;
      }
      if (req.body.noOfProblemSolved) {
        query.noOfProblemSolved = req.body.noOfProblemSolved;
      }
      if (req.body.solvedProblemDetails) {
        query.solvedProblemDetails = req.body.solvedProblemDetails;
      }
      if (req.body.praticeCourseDetail) {
        query.praticeCourseDetail = req.body.praticeCourseDetail;
      }
      if (req.body.noOfContestParticipated) {
        query.noOfContestParticipated = req.body.noOfContestParticipated;
      }
      if (req.body.contestDetails) {
        query.contestDetails = req.body.contestDetails;
      }
      if (req.body.gender) {
        query.gender = req.body.gender;
      }
      if (req.body.linkedin_url) {
        query.linkedin_url = req.body.linkedin_url;
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
      if (req.body.ThirdPartyLoginAccess) {
        query.ThirdPartyLoginAccess = req.body.ThirdPartyLoginAccess;
      }
      if (req.body.password) {
        let salt = await bcrypt.genSalt(10);
        console.log("-------password-", req.body.password);

        let hashPassword = await bcrypt.hash(req.body.password, salt);
        query.password = hashPassword;
      }

      if (req.body.profilePictureUrl) {
        query.profilePictureUrl = req.body.profilePictureUrl;
      }
      if (Object.keys(query).length === 0) {
        return res.send({ success, msg: "Empty Content" });
      }
      console.log({ ...query });
      console.log("id-", userDetails.result.id);

      let result = await prisma.user.update({
        where: { id: userDetails.result.id },
        data: {
          ...query,
        },
      });

      success = true;
      return res.send({ success, result: { ...result, token: req.body.token } }); // Sending the user object as response
    } catch (error) {
      console.log(error);
      return res.status(500).send({ success, error });
    }
  }
);

router.post(
  "/login",
  [
    body("email", "Please enter your email").exists(),
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
      console.log(email, "---", password);

      let check1 = await UserFunctions.isUserExist(email);
      console.log("check1-", check1);

      if (!check1) {
        return res.send({ success, msg: "User Not Exist" });
      }
      console.log("c1");

      let u1 = await prisma.user.findFirst({ where: { email } });
      console.log("c2-", u1);
      console.log("u1-", password, "---", u1?.password);
      console.log("c3");
      let result = await bcrypt.compare(password, u1?.password);
      console.log("c4");
      console.log("final-", result);
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
      return res.send({ success, result: { ...u1, token: token } }); // Sending the user object as response
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
      let error = validationResult(req);
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






router.post("/sendemail", sendEmail.sendEmail);
router.post("/thirdpartylogin", ThirdPartyLogin.googleLogin);

module.exports = router;
