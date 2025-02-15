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
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const client_1 = require("@prisma/client");
const express_validator_1 = require("express-validator");
const router = (0, express_1.Router)();
const ServerUrl = process.env.ServerUrl || "http://localhost:8000";
console.log(ServerUrl);
const prisma = new client_1.PrismaClient();
router.get("/", (req, res) => {
    res.send({ success: "OneToOneCompete Routing is on" });
});
router.post("/createonetoonecompeteleaderboard", [
    (0, express_validator_1.body)("user", "Please Enter a both user id").exists()
], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let success = false;
    try {
        let error = (0, express_validator_1.validationResult)(req);
        if (!error.isEmpty()) {
            return res.status(404).send({ success, error: error.array() });
        }
        let { user } = req.body;
        console.log("user-", user);
        let check1 = yield prisma.user.findMany({ where: { id: { in: [...user] } } });
        console.log("check1 - ", check1);
        if (check1.length !== 2)
            return res.send({ success, msg: `User Id not found - ${user}` });
        let t = yield prisma.problemSet.count();
        console.log("count - ", t);
        const randomNumber = Math.floor(Math.random() * t) + 1;
        const problem = yield prisma.problemSet.findFirst({ where: { problemNo: randomNumber } });
        if (!problem)
            return res.send({ success, msg: "Problem not found" });
        let result = yield prisma.oneToOneCompeteLeaderboard.create({
            data: {
                user,
                Result: "TIE",
                duration: 20,
                problemId: problem.id
            },
        });
        let result2 = yield prisma.user.updateMany({ where: { id: { in: [...user] } }, data: {
                oneToOneCompeteLeaderboardId: { push: result.id }
            } });
        console.log("result - ", result);
        console.log("result2 - ", result2);
        success = true;
        return res.send({ success, result, msg: "Compete Leaderboard Created" });
    }
    catch (error) {
        console.log(error);
        return res.status(500).send({ success, error, msg: "Internal Server Error" });
    }
}));
router.put("/updateonetoonecompeteleaderboard", [
    (0, express_validator_1.body)("Result", "Please enter a result").exists(),
    (0, express_validator_1.body)("leaderboardId", "Please enter a leaderboardId").exists()
], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let success = false;
    try {
        let error = (0, express_validator_1.validationResult)(req);
        if (!error.isEmpty()) {
            return res.status(404).send({ success, error: error.array() });
        }
        let { Result, leaderboardId } = req.body;
        const u1 = yield prisma.oneToOneCompeteLeaderboard.findFirst({ where: { id: leaderboardId } });
        if (!u1)
            return res.send({ success, msg: "Leaderboard not found" });
        const check2 = yield prisma.user.findFirst({ where: { id: Result } });
        if (!check2)
            return res.send({ success, msg: "Result - UserId not found" });
        let newresult = "TIE";
        if (u1.Result === "TIE") {
            newresult = Result;
        }
        if (u1.Result !== "TIE") {
            return res.send({ success, msg: "Already Declared" });
        }
        const result = yield prisma.oneToOneCompeteLeaderboard.update({ where: { id: leaderboardId },
            data: {
                Result: newresult
            } });
        success = true;
        return res.send({ success, result, msg: "Updated Leaderboard" });
    }
    catch (error) {
        console.log(error);
        return res.status(500).send({ success, error, msg: "Internal Server Error" });
    }
}));
router.get("/getonetoonecompeteleaderboard/:userid", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let success = false;
    try {
        let error = (0, express_validator_1.validationResult)(req);
        if (!error.isEmpty()) {
            return res.status(404).send({ success, error: error.array() });
        }
        const userid = req.params.userid;
        const result1 = yield prisma.oneToOneCompeteLeaderboard.findMany({
            where: { user: { has: userid } }
        });
        if (result1.length === 0)
            return res.send({ success, msg: "user not exist" });
        success = true;
        return res.send({ success, result1, msg: "Updated Leaderboard" });
    }
    catch (error) {
        console.log(error);
        return res.status(500).send({ success, error, msg: "Internal Server Error" });
    }
}));
module.exports = router;
