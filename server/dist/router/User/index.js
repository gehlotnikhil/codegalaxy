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
const router = (0, express_1.Router)();
const GoogleLogin_1 = __importDefault(require("./GoogleLogin"));
const prisma = new client_1.PrismaClient();
router.get("/", (req, res) => {
    res.send({ success: "User Routing is on" });
});
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
    // Check for validation errors
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).send({ error: errors.array() });
    }
    let success = false;
    try {
        const { name, age, email, password, gender, state, country, collegeName, userName, } = req.body;
        // Create the user in the database
        const result = yield prisma.user.create({
            data: {
                name: name,
                age: age,
                email: email,
                password: password,
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
                role: { User: true, Admin: false }
            },
        });
        console.log("User created:", result);
        success = true;
        res.send({ success, user: result }); // Sending the user object as response
    }
    catch (error) {
        console.error("Error during user creation:", error);
        res.status(500).send({ success, error });
    }
}));
router.post("/googlelogin", GoogleLogin_1.default.googleLogin);
module.exports = router;
