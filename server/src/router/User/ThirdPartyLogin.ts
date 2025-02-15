import { Request, Response, Router } from "express";
import UserFunctions from "../lib/UserFunctions";
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const jwt = require("jsonwebtoken")
let JWT_Secret = "Nikhil123"
import { faker } from "@faker-js/faker";

function generateRandomName() {
  // Generate a random name using faker
  const firstName = faker.person.firstName(); // Random first name
  const lastName = faker.person.lastName(); // Random last name

  return `${firstName} ${lastName}`;
}
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
      let name: string = generateRandomName();

      result = await prisma.user.create({
        data: {
          name,
          email: email,
          totalRank: 1000,
          userName: new_username,
          linkedin_url: null,
          ContestDetail: [],
          solvedProblemDetails: [],
          activeDays: [],
          ThirdPartyLoginAccess: true,
          isAdmin:false,
          oneToOneCompeteLeaderboardId:[],
          profilePictureUrl:"https://res.cloudinary.com/diqpelkm9/image/upload/f_auto,q_auto/k4s9mgdywuaasjuthfxk",
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
