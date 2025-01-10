import { Request, Response, Router } from "express";
import UserFunctions from "../lib/UserFunctions";
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const jwt = require("jsonwebtoken")
let JWT_Secret = "Nikhil123"

function generateUsername(length = 8) {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let username = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    username = characters[randomIndex] + username;
  }

  return username;
}

const hello = () => {
  console.log("Hello");
};
const googleLogin = async (req: Request, res: Response): Promise<any> => {
  let success = false;
  let { email } = req.body;
  console.log("g-", email);

  try {
    console.log("1");

    let check1 = await UserFunctions.isUserExist(email);
    console.log("2");
    let result: any = [];
    console.log(check1);
    let new_username = generateUsername();
    let count = 0;

    console.log("3");
    if (!check1) {
      console.log("created");
      
      result = await prisma.user.create({
        data: {
          email: email,
          totalRank: 1000,
          noOfProblemSolved: 0,
          userName: new_username,
          solvedProblemDetails: [],
          noOfContestParticipated: 0,
          contestDetails: [],
          googleLoginAccess: true,
          role: { User: true, Admin: false },
          profilePictureUrl:"https://res.cloudinary.com/diqpelkm9/image/upload/f_auto,q_auto/k4s9mgdywuaasjuthfxk"
        },
      });
    }
    result = await prisma.user.findFirst({where:{email}})
    console.log("final-",result);
    let data = {
      id : result.id
    }
    let token = jwt.sign(data,JWT_Secret)
    console.log("4");
    success = true;
    res.send({ success,result:{...result,token:token}});
  } catch (error) {
    console.log("Google Login Error - ", error);
    res.send({ success, error, msg: "Google Login Error" });
  }
};
const GoogleLogin = { googleLogin, hello };
export default GoogleLogin;
