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
const faker_1 = require("@faker-js/faker");
function generateRandomName() {
    // Generate a random name using faker
    const firstName = faker_1.faker.person.firstName(); // Random first name
    const lastName = faker_1.faker.person.lastName(); // Random last name
    return `${firstName} ${lastName}`;
}
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
            let name = generateRandomName();
            result = yield prisma.user.create({
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
        }
        result = yield prisma.user.findFirst({ where: { email } });
        console.log("final-", result);
        let data = {
            id: result.id
        };
        let token = jwt.sign(data, JWT_Secret);
        console.log("4");
        success = true;
        res.send({ success, result: Object.assign(Object.assign({}, result), { token: token }) });
    }
    catch (error) {
        console.log("Google Login Error - ", error);
        res.send({ success, error, msg: "Google Login Error" });
    }
});
const GoogleLogin = { googleLogin, hello };
exports.default = GoogleLogin;
