import dotenv from "dotenv";
dotenv.config();
import { google } from "googleapis";

import { Request, Response, Router } from "express";
import UserFunctions from "../lib/UserFunctions";
const jwt = require("jsonwebtoken")
let JWT_Secret = "Nikhil123"
import nodemailer from "nodemailer";
import { withPrisma } from "../../lib/prisma_callback";

function generateOTP(length: number = 6): string {
    return Math.floor(100000 + Math.random() * 900000).toString(); // Generates a 6-digit OTP
}


const hello = () => {
    console.log("Hello");
};
const sendEmail = withPrisma(async (req: Request, res: Response,prisma:any): Promise<any> => {
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
                let result = await prisma.emailOtpService.create({
                    data: {
                        email,
                        code: Number(otp)
                    }
                })
                const date = new Date(result.createdAt);

                const seconds = date.getUTCHours() * 3600 + date.getUTCMinutes() * 60 + date.getUTCSeconds() + date.getUTCMilliseconds() / 1000;

                console.log(result.createdAt);
                console.log((Date.now() - new Date(result.createdAt).getTime())/(1000));
                console.log((Date.now(), " ", new Date(result.createdAt).getTime()));
                console.log(Math.floor((Date.now(), " ", new Date(result.createdAt).getTime())) / (1000*60));

                success = true;
                res.send({ success, msg: "Email Send", result })



            }
        });




    } catch (error) {
        console.log(" Error - ", error);
        res.send({ success, error, msg: " Error" });
    }

});
const sendingEmail = { sendEmail, hello };
export default sendingEmail;
