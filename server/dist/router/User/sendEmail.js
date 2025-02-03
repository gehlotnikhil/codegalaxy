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
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const googleapis_1 = require("googleapis");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const jwt = require("jsonwebtoken");
let JWT_Secret = "Nikhil123";
const nodemailer_1 = __importDefault(require("nodemailer"));
function generateOTP(length = 6) {
    return Math.floor(100000 + Math.random() * 900000).toString(); // Generates a 6-digit OTP
}
const hello = () => {
    console.log("Hello");
};
const sendEmail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let success = false;
    let { email } = req.body;
    console.log("g-", email);
    const otp = generateOTP(); // Generate OTP
    console.log(`Generated OTP: ${otp}`);
    try {
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
                let result = yield prisma.emailOtpService.create({
                    data: {
                        email,
                        code: Number(otp)
                    }
                });
                const date = new Date(result.createdAt);
                const seconds = date.getUTCHours() * 3600 + date.getUTCMinutes() * 60 + date.getUTCSeconds() + date.getUTCMilliseconds() / 1000;
                console.log(result.createdAt);
                console.log((Date.now() - new Date(result.createdAt).getTime()) / (1000));
                console.log((Date.now(), " ", new Date(result.createdAt).getTime()));
                console.log(Math.floor((Date.now(), " ", new Date(result.createdAt).getTime())) / (1000 * 60));
                success = true;
                res.send({ success, msg: "Email Send", result });
            }
        }));
    }
    catch (error) {
        console.log(" Error - ", error);
        res.send({ success, error, msg: " Error" });
    }
});
const sendingEmail = { sendEmail, hello };
exports.default = sendingEmail;
