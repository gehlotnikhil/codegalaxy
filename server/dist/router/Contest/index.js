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
const prisma = new client_1.PrismaClient();
const ServerUrl = process.env.ServerUrl || "http://localhost:8000";
console.log(ServerUrl);
const router = (0, express_1.Router)();
const { body, validationResult } = require("express-validator");
router.get("/", (req, res) => {
    res.send({ success: "Contest Routing is on" });
});
// console.log("-->",prisma);
router.post("/create", [
    body("contestName", "Please Enter a contestName").exists(),
    body("duration", "Please Enter a duration").exists(),
    body("startTime", "Please Enter a startTime").exists(),
    body("problems", "Please Enter a problems's id").exists(),
], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let success = false;
    try {
        let error = validationResult(req);
        if (!error.isEmpty()) {
            return res.status(404).send({ success, error: error.array() });
        }
        let { contestName, duration, startTime, problems, } = req.body;
        let newNumber = 1;
        let t = (yield prisma.contest.findMany());
        console.log("1- ", t);
        console.log("1- ", t.length);
        if (t.length !== 0) {
            console.log(t[t.length - 1].contestNo);
            console.log("2- ", t[t.length - 1].contestNo);
            console.log(t);
            if (t.length > 0) {
                newNumber = t[t.length - 1].contestNo + 1;
            }
            console.log("3- ", newNumber);
        }
        for (const e of problems) {
            let response1 = yield prisma.contestProblem.findFirst({ where: { id: e } });
            if (!response1) {
                return res.status(400).json({ success, msg: `${e} not found` });
            }
        }
        let result = yield prisma.contest.create({
            data: {
                contestNo: newNumber,
                contestName,
                duration,
                startTime: new Date(startTime),
                problems,
            },
        });
        console.log(result);
        const response2 = yield fetch(`${ServerUrl}/api/contest/leaderboard/create/${result.id}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" }
        });
        success = true;
        return res.send({ success, body: req.body, msg: "Contest Created" });
    }
    catch (error) {
        console.log(error);
        return res.status(500).send({ success, error });
    }
}));
router.put("/update/:contestno", [], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let success = false;
    try {
        let error = validationResult(req.body);
        if (!error.isEmpty()) {
            return res.status(404).send({ success, error: error.array() });
        }
        let query = {};
        if (req.body.contestName) {
            query.contestName = req.body.contestName;
        }
        if (req.body.startTime) {
            query.startTime = req.body.startTime;
        }
        if (req.body.duration) {
            query.duration = req.body.duration;
        }
        if (req.body.problems) {
            query.problems = req.body.problems;
        }
        if (Object.keys(query).length === 0) {
            return res.send({ success, msg: "Empty Content" });
        }
        let result = yield prisma.contest.update({
            where: { contestNo: Number.parseInt(req.params.contestno) }, data: Object.assign({}, query)
        });
        success = true;
        return res.send({ success, msg: "Update successfull" });
    }
    catch (error) {
        console.log(error);
        return res.status(500).send({ success, error });
    }
}));
router.delete("/delete/:contestno", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let success = false;
    try {
        let check1 = yield prisma.contest.findFirst({ where: { contestNo: Number.parseInt(req.params.contestno) } });
        if (!check1) {
            return res.send({ success, msg: "Contest not Exist" });
        }
        let result = yield prisma.contest.delete({ where: { contestNo: Number.parseInt(req.params.contestno) } });
        yield prisma.contest.updateMany({
            where: {
                contestNo: {
                    gt: Number.parseInt(req.params.contestno),
                },
            },
            data: {
                contestNo: {
                    decrement: 1, // Decrease the problemNo for each problem after the deleted one
                },
            },
        });
        success = true;
        return res.send({ success, msg: "Deleted", result });
    }
    catch (error) {
        console.log(error);
        return res.status(500).send({ success, error });
    }
}));
router.get("/getallcontest", [], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let success = false;
    try {
        let result = yield prisma.contest.findMany();
        console.log(result);
        success = true;
        return res.send({ success, result });
    }
    catch (error) {
        console.log(error);
        return res.status(500).send({ success, error });
    }
}));
router.get("/getcontestproblemfromcontestid/:contestid", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let success = false;
    try {
        const c = req.params.contestid;
        console.log("Contest ID:", c);
        let res1 = yield prisma.contest.findFirst({ where: { id: c } });
        if (!res1) {
            return res.status(404).send({ success, msg: "Not found" });
        }
        const problemIds = res1.problems;
        console.log("Problem IDs:", problemIds);
        let result = [];
        for (const e of problemIds) {
            const problem = yield prisma.contestProblem.findFirst({ where: { id: e } });
            console.log("Problem:", problem);
            if (problem)
                result.push(problem);
        }
        console.log("Final Result:", result);
        success = true;
        return res.send({ success, result });
    }
    catch (error) {
        console.error(error);
        return res.status(500).send({ success, error: "Internal Server Error" });
    }
}));
router.get("/getspecificcontest", [], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let success = false;
    try {
        let { id, no } = req.query;
        if (!id && !no) {
            return res.send({ success, msg: "Please provide id or no" });
        }
        let result;
        if (no) {
            result = yield prisma.contest.findFirst({ where: { contestNo: Number.parseInt(no) } });
        }
        if (id) {
            result = yield prisma.contest.findFirst({ where: { id: id } });
        }
        if (result === null) {
            success = false;
        }
        else {
            success = true;
        }
        console.log(result);
        return res.send({ success, result });
    }
    catch (error) {
        console.log(error);
        return res.status(500).send({ success, error });
    }
}));
router.get("/leaderboard/create/:contestid", [], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let success = false;
    try {
        let { contestid } = req.params;
        if (!contestid) {
            return res.send({ success, msg: "Please provide ContestId" });
        }
        let result;
        result = yield prisma.leaderBoard.create({ data: {
                contestid,
            } });
        if (result === null) {
            success = false;
        }
        else {
            success = true;
        }
        console.log(result);
        return res.send({ success, result });
    }
    catch (error) {
        console.log(error);
        return res.status(500).send({ success, error });
    }
}));
module.exports = router;
