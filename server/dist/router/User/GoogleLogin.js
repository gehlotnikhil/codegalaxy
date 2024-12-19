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
const UserFunctions_1 = __importDefault(require("../lib/UserFunctions"));
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const jwt = require("jsonwebtoken");
let JWT_Secret = "Nikhil123";
function generateUsername(length = 8) {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
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
const googleLogin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let success = false;
    let { email } = req.body;
    console.log("g-", email);
    try {
        console.log("1");
        let check1 = yield UserFunctions_1.default.isUserExist(email);
        console.log("2");
        let result = [];
        console.log(check1);
        let new_username = generateUsername();
        let count = 0;
        console.log("3");
        if (!check1) {
            console.log("created");
            result = yield prisma.user.create({
                data: {
                    name: "Lucifer",
                    age: -1,
                    password: "",
                    gender: "",
                    state: "",
                    country: "",
                    collegeName: "",
                    email: email,
                    totalRank: 1000,
                    noOfProblemSolved: 0,
                    userName: new_username,
                    solvedProblemDetails: [],
                    noOfContestParticipated: 0,
                    contestDetails: [],
                    googleLoginAccess: true,
                    role: { User: true, Admin: false },
                },
            });
        }
        result = yield prisma.user.findFirst({ where: { email } });
        console.log("final-", result);
        let data = {
            id: result.id
        };
        let token = jwt.sign(data, JWT_Secret);
        console.log("4");
        success = true;
        res.send({ success, result, token });
    }
    catch (error) {
        console.log("Google Login Error - ", error);
        res.send({ success, error, msg: "Google Login Error" });
    }
});
const GoogleLogin = { googleLogin, hello };
exports.default = GoogleLogin;
