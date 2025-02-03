"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const client_1 = require("@prisma/client");
const express_validator_1 = require("express-validator");
const UserFunctions_1 = __importDefault(require("../lib/UserFunctions"));
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const router = (0, express_1.Router)();
const axios = require("axios");
const sendEmail_1 = __importDefault(require("./sendEmail"));
const ServerUrl = process.env.ServerUrl || "http://localhost:8000";
console.log(ServerUrl);
const GoogleLogin_1 = __importDefault(require("./GoogleLogin"));
const prisma = new client_1.PrismaClient();
const faker_1 = require("@faker-js/faker");
function generateRandomName() {
    // Generate a random name using faker
    const firstName = faker_1.faker.person.firstName(); // Random first name
    const lastName = faker_1.faker.person.lastName(); // Random last name
    return `${firstName} ${lastName}`;
}
router.get("/", (req, res) => {
    res.send({ success: "User Routing is on" });
});
let JWT_Secret = "Nikhil123";
const googleapis_1 = require("googleapis");
const nodemailer_1 = __importDefault(require("nodemailer"));
function generateOTP(length = 6) {
    return Math.floor(100000 + Math.random() * 900000).toString(); // Generates a 6-digit OTP
}
// User Registration route
router.post("/registeruser", [
    (0, express_validator_1.body)("email", "Please Enter Your Email").exists(),
    (0, express_validator_1.body)("email", "Enter Valid Email Format").isEmail(),
    (0, express_validator_1.body)("password", "Please Enter Your Password").exists(),
    (0, express_validator_1.body)("userName", "Please Enter Your Username").exists(),
], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let success = false;
    const otp = generateOTP(); // Generate OTP
    console.log(`Generated OTP: ${otp}`);
    try {
        const { email, password, userName } = req.body;
        // Check for validation errors
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).send({ success, error: errors.array() });
        }
        // check User Exist or not
        let check1 = yield UserFunctions_1.default.isUserExist(email);
        if (check1) {
            return res.send({ success, msg: "User Already Exist" });
        }
        let check2 = yield UserFunctions_1.default.isUserNameExist(userName);
        if (check2) {
            return res.send({ success, msg: "UserName Already Exist" });
        }
        //Main Logic
        //encrypt the password
        let salt = yield bcrypt.genSalt(10);
        let hashPassword = yield bcrypt.hash(password, salt);
        console.log(process.env.CLIENT_ID);
        console.log(process.env.CLIENT_SECRET);
        console.log(process.env.REFRESH_TOKEN);
        console.log("1");
        const OAuth2 = googleapis_1.google.auth.OAuth2;
        console.log("2");
        const oauth2Client = new OAuth2(process.env.CLIENT_ID, process.env.CLIENT_SECRET, "https://developers.google.com/oauthplayground");
        console.log("3");
        oauth2Client.setCredentials({
            refresh_token: process.env.REFRESH_TOKEN,
        });
        console.log("4");
        const accessToken = yield oauth2Client.getAccessToken();
        console.log("5");
        console.log("access token - ", accessToken.token);
        console.log("6");
        const transporter = nodemailer_1.default.createTransport({
            service: "gmail",
            auth: {
                type: "OAuth2",
                user: process.env.EMAIL,
                clientId: process.env.CLIENT_ID,
                clientSecret: process.env.CLIENT_SECRET,
                refreshToken: process.env.REFRESH_TOKEN,
                accessToken: accessToken.token,
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
        transporter.sendMail(mailOptions, (err, info) => __awaiter(void 0, void 0, void 0, function* () {
            if (err) {
                console.error("Error:", err);
                res.send({ success, msg: "Internal server Error" });
            }
            else {
                console.log("Email sent-:", info.response);
                // Delete Previous OTP Data if exist
                const r = yield prisma.emailOtpService.deleteMany({ where: { email } });
                const result = yield prisma.emailOtpService.create({
                    data: {
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
                res.send({ success, result: Object.assign({}, result) }); // Sending the user object as response
            }
        }));
    }
    catch (error) {
        console.error("Error during user creation:", error);
        res.status(500).send({ success, error });
    }
}));
router.post("/verify", [
    (0, express_validator_1.body)("code", "Please Enter Your OTP Code").exists(),
    (0, express_validator_1.body)("verifyemail", "Please Enter Your email").exists(),
], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let success = false;
    try {
        const { code, verifyemail } = req.body;
        // Check for validation errors
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).send({ success, error: errors.array() });
        }
        let name = generateRandomName();
        const r = yield prisma.emailOtpService.findFirst({ where: { code: code, email: verifyemail } });
        console.log("hh----", r);
        // if code not found
        if (!r) {
            res.send({ success, msg: "Incorrect OTP" });
        }
        console.log(r === null || r === void 0 ? void 0 : r.createdAt);
        console.log(Math.abs(Date.now() - new Date((r === null || r === void 0 ? void 0 : r.createdAt) || "2025-02-03T16:30:00").getTime()) / 1000);
        // delete otp 
        const k = yield prisma.emailOtpService.deleteMany({ where: { code, email: verifyemail } });
        if ((Math.abs(Date.now() - new Date((r === null || r === void 0 ? void 0 : r.createdAt) || "2025-02-03T16:30:00").getTime()) / 1000) > 60) {
            return res.send({ success, msg: "OTP is Expired" });
        }
        else if (r && r.email && r.password && r.userName) {
            // creating user
            const result = yield prisma.user.create({
                data: {
                    name: name,
                    email: r.email,
                    password: r.password,
                    userName: r.userName,
                    totalRank: 1000,
                    solvedProblemDetails: [],
                    activeDays: [],
                    googleLoginAccess: false,
                    isAdmin: false,
                    profilePictureUrl: "https://res.cloudinary.com/diqpelkm9/image/upload/f_auto,q_auto/k4s9mgdywuaasjuthfxk",
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
            res.send({ success, result: Object.assign(Object.assign({}, result), { token: token }) }); // Sending the user object as response
        }
    }
    catch (error) {
        console.error("Error during user creation:", error);
        res.status(500).send({ success, error });
    }
}));
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
//           googleLoginAccess: false,
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
router.put("/update/", [
    (0, express_validator_1.body)("token", "Please fill the token field").exists(),
    (0, express_validator_1.body)("name", "Please fill Name field").exists(),
    (0, express_validator_1.body)("age", "Please fill age field").exists(),
    (0, express_validator_1.body)("email", "Please fill email field").exists(),
    (0, express_validator_1.body)("password", "Please fill password field").exists(),
    (0, express_validator_1.body)("userName", "Please fill userName field").exists(),
    (0, express_validator_1.body)("totalRank", "Please fill totalRank field").exists(),
    (0, express_validator_1.body)("noOfProblemSolved", "Please fill noOfProblemSolved field").exists(),
    (0, express_validator_1.body)("solvedProblemDetails", "Please fill solvedProblemDetails field").exists(),
    (0, express_validator_1.body)("noOfContestParticipated", "Please fill noOfContestParticipated field").exists(),
    (0, express_validator_1.body)("contestDetails", "Please fill contestDetails field").exists(),
    (0, express_validator_1.body)("gender", "Please fill gender field").exists(),
    (0, express_validator_1.body)("collegeName", "Please fill collegeName field").exists(),
    (0, express_validator_1.body)("state", "Please fill state field").exists(),
    (0, express_validator_1.body)("country", "Please fill country field").exists(),
    (0, express_validator_1.body)("role", "Please fill role field").exists(),
    (0, express_validator_1.body)("googleLoginAccess", "Please fill googleLoginAccess field").exists(),
    (0, express_validator_1.body)("profilePictureUrl", "Please fill profilePictureUrl field").exists(),
    (0, express_validator_1.body)("activeDays", "Please fill activeDays field").exists(),
], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let success = false;
    try {
        const response = yield axios.post(`${ServerUrl}/api/user/tokentodata`, { token: req.body.token }, {
            headers: {
                "Content-Type": "application/json",
            },
        });
        const userDetails = response.data;
        if (userDetails.success === false) {
            return res.send({
                success,
                msg: "Failed to Update because of internal isssue",
            });
        }
        console.log(userDetails);
        let error = (0, express_validator_1.validationResult)(req.body);
        if (!error.isEmpty()) {
            return res.status(404).send({ success, error: error.array() });
        }
        let query = {};
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
            let salt = yield bcrypt.genSalt(10);
            console.log("-------password-", req.body.password);
            let hashPassword = yield bcrypt.hash(req.body.password, salt);
            query.password = hashPassword;
        }
        if (req.body.profilePictureUrl) {
            query.profilePictureUrl = req.body.profilePictureUrl;
        }
        if (Object.keys(query).length === 0) {
            return res.send({ success, msg: "Empty Content" });
        }
        console.log(Object.assign({}, query));
        console.log("id-", userDetails.result.id);
        let result = yield prisma.user.update({
            where: { id: userDetails.result.id },
            data: Object.assign({}, query),
        });
        success = true;
        return res.send({ success, result: Object.assign(Object.assign({}, result), { token: req.body.token }) }); // Sending the user object as response
    }
    catch (error) {
        console.log(error);
        return res.status(500).send({ success, error });
    }
}));
router.post("/login", [
    (0, express_validator_1.body)("email", "Please neter your email").exists(),
    (0, express_validator_1.body)("password", "Please enter your password"),
], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let success = false;
    try {
        console.log("1");
        console.log("1");
        console.log("1");
        console.log("1");
        let error = (0, express_validator_1.validationResult)(req.body);
        if (!error.isEmpty) {
            return res.status(404).send({ success, error: error.array() });
        }
        let { email, password } = req.body;
        console.log("2");
        console.log(email, "---", password);
        let check1 = yield UserFunctions_1.default.isUserExist(email);
        console.log("check1-", check1);
        if (!check1) {
            return res.send({ success, msg: "User Not Exist" });
        }
        console.log("c1");
        let u1 = yield prisma.user.findFirst({ where: { email } });
        console.log("c2-", u1);
        console.log("u1-", password, "---", u1 === null || u1 === void 0 ? void 0 : u1.password);
        console.log("c3");
        let result = yield bcrypt.compare(password, u1 === null || u1 === void 0 ? void 0 : u1.password);
        console.log("c4");
        console.log("final-", result);
        console.log("c5");
        if (!result) {
            return res.status(404).send({ success, msg: "Password is Incorrect" });
        }
        let data = {
            id: u1 === null || u1 === void 0 ? void 0 : u1.id,
        };
        console.log("c6");
        let token = yield jwt.sign(data, JWT_Secret);
        success = true;
        return res.send({ success, result: Object.assign(Object.assign({}, u1), { token: token }) }); // Sending the user object as response
    }
    catch (error) {
        console.log(error);
        res.status(500).send({ success, error });
    }
}));
router.get("/getspecificuser", [
    (0, express_validator_1.body)("email", "Please enter your email").exists(),
    (0, express_validator_1.body)("email", "Please enter correct email format").isEmail(),
], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let success = false;
    try {
        let error = (0, express_validator_1.validationResult)(req.body);
        if (!error.isEmpty()) {
            return res.status(404).send({ success, error: error.array() });
        }
        let { email } = req.body;
        let check1 = yield UserFunctions_1.default.isUserExist(email);
        if (!check1) {
            return res.status(404).send({ success, msg: "User not Exist" });
        }
        let result = yield prisma.user.findFirst({ where: { email } });
        success = true;
        return res.send({ success, result });
    }
    catch (error) {
        console.log(error);
        return res.status(505).send({ success, error });
    }
}));
router.get("/getalluser", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let success = false;
    try {
        let result = yield prisma.user.findMany();
        success = true;
        return res.send({ success, result });
    }
    catch (error) {
        console.log(error);
        return res.status(505).send({ success, error });
    }
}));
router.post("/tokentodata", [(0, express_validator_1.body)("token", "Please enter a token").exists()], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let success = false;
    try {
        let error = (0, express_validator_1.validationResult)(req);
        if (!error.isEmpty()) {
            return res.status(404).send({ success, error: error.array() });
        }
        let { token } = req.body;
        let decode = yield jwt.decode(token);
        console.log("token - ", token);
        console.log("decode-", decode);
        let id = decode.id;
        console.log(id);
        let result = yield prisma.user.findFirst({ where: { id } });
        success = true;
        return res.send({ success, result });
    }
    catch (error) {
        console.log(error);
        return res.status(500).send({ success, error });
    }
}));
router.post("/usernametodata", [(0, express_validator_1.body)("userName", "Please enter a username").exists()], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let success = false;
    try {
        let error = (0, express_validator_1.validationResult)(req.body);
        if (!error.isEmpty()) {
            return res.status(404).send({ success, error: error.array() });
        }
        let { userName } = req.body;
        console.log("u-", userName);
        let result = yield prisma.user.findFirst({ where: { userName } });
        console.log("res-", result);
        if (!result) {
            return res.send({ success, msg: "Username not exist" });
        }
        success = true;
        return res.send({ success, result });
    }
    catch (error) {
        console.log(error);
        return res.status(500).send({ success, error });
    }
}));
router.post("/sendemail", sendEmail_1.default.sendEmail);
router.post("/googlelogin", GoogleLogin_1.default.googleLogin);
module.exports = router;
