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
const GoogleLogin_1 = __importDefault(require("./GoogleLogin"));
const prisma = new client_1.PrismaClient();
router.get("/", (req, res) => {
    res.send({ success: "User Routing is on" });
});
let JWT_Secret = "Nikhil123";
// User Registration route
router.post("/registeruser", [
    (0, express_validator_1.body)("name", "Please Enter Your Name").exists(),
    (0, express_validator_1.body)("age", "Please Enter Your Age").exists(),
    (0, express_validator_1.body)("email", "Please Enter Your Email").exists(),
    (0, express_validator_1.body)("email", "Enter Valid Email Format").isEmail(),
    (0, express_validator_1.body)("password", "Please Enter Your Password").exists(),
    (0, express_validator_1.body)("gender", "Please Enter Your Gender").exists(),
    (0, express_validator_1.body)("userName", "Please Enter Your Username").exists(),
    (0, express_validator_1.body)("collegeName", "Please Enter Your CollegeName").exists(),
    (0, express_validator_1.body)("state", "Please Enter Your State").exists(),
    (0, express_validator_1.body)("country", "Please Enter Your Country").exists(),
], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let success = false;
    try {
        const { name, age, email, password, gender, state, country, collegeName, userName, } = req.body;
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
        //Main Logic
        //encrypt the password
        let salt = yield bcrypt.genSalt(10);
        let hashPassword = yield bcrypt.hash(password, salt);
        // Create the user in the database
        const result = yield prisma.user.create({
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
    }
    catch (error) {
        console.error("Error during user creation:", error);
        res.status(500).send({ success, error });
    }
}));
router.get("/login", [
    (0, express_validator_1.body)("email", "Please neter your email").exists(),
    (0, express_validator_1.body)("password", "Please enter your password")
], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let success = false;
    try {
        let error = (0, express_validator_1.validationResult)(req.body);
        if (!error.isEmpty) {
            return res.status(404).send({ success, error: error.array() });
        }
        let { email, password } = req.body;
        let check1 = yield UserFunctions_1.default.isUserExist(email);
        if (!check1) {
            return res.send({ success, msg: "User Not Exist" });
        }
        let u1 = yield prisma.user.findFirst({ where: { email } });
        let result = yield bcrypt.compare(password, u1 === null || u1 === void 0 ? void 0 : u1.password);
        if (!result) {
            return res.status(404).send({ success, msg: "Password is Incorrect" });
        }
        let data = {
            id: u1 === null || u1 === void 0 ? void 0 : u1.id
        };
        let token = yield jwt.sign(data, JWT_Secret);
        success = true;
        return res.send({ success, token });
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
router.get("/tokentodata", [
    (0, express_validator_1.body)("token", "Please enter a token").exists()
], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let success = false;
    try {
        let error = (0, express_validator_1.validationResult)(req.body);
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
router.get("/usernametodata", [
    (0, express_validator_1.body)("userName", "Please enter a username").exists()
], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
            return res.send({ success, msg: "Username name exist" });
        }
        success = true;
        return res.send({ success, result });
    }
    catch (error) {
        console.log(error);
        return res.status(500).send({ success, error });
    }
}));
router.post("/googlelogin", GoogleLogin_1.default.googleLogin);
module.exports = router;
