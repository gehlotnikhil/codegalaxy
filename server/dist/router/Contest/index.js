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
const nodemailer_1 = __importDefault(require("nodemailer"));
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
router.post("/notify-all-users", [
    body("contestName", "Please Enter a contestName").exists(),
    body("duration", "Please Enter a duration").exists(),
], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let success = false;
    // Validate request body
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success, errors: errors.array() });
    }
    const { contestName, duration } = req.body;
    try {
        // Fetch all users' emails from the database
        const users = yield prisma.user.findMany({ select: { email: true } });
        const emails = users.map((user) => user.email);
        if (emails.length === 0) {
            return res.status(400).json({ success, msg: "No users found to notify" });
        }
        // Set up Nodemailer transport
        const transporter = nodemailer_1.default.createTransport({
            service: "gmail",
            auth: {
                type: "OAuth2",
                user: process.env.EMAIL,
                clientId: process.env.CLIENT_ID,
                clientSecret: process.env.CLIENT_SECRET,
                refreshToken: process.env.REFRESH_TOKEN,
            },
        });
        // Email options
        const mailOptions = (email) => ({
            from: process.env.EMAIL,
            to: email,
            subject: `New Contest: ${contestName}!`,
            html: `
          <div style="font-family: Arial, sans-serif; padding: 20px;">
            <h2 style="color: #000;">CodeGalaxy Contest Alert!</h2>
            <h1 style="color: #0078D4;">${contestName}</h1>
            <p>We are excited to announce a new contest!</p>
            <p><strong>Duration:</strong> ${duration}</p>
            <p>Prepare yourself and start coding!</p>
            <p>Thanks, <br> The CodeGalaxy Team</p>
          </div>
        `,
        });
        // Send emails concurrently
        const emailPromises = emails.map((email) => transporter.sendMail(mailOptions(email)).catch((err) => {
            console.error(`Failed to send email to ${email}:`, err);
            return null; // Handle failed emails gracefully
        }));
        yield Promise.all(emailPromises);
        success = true;
        return res.json({ success, msg: "Emails sent successfully!" });
    }
    catch (error) {
        console.error("Error:", error);
        return res.status(500).json({ success, error });
    }
}));
router.post("/create", [
    body("contestName", "Please Enter a contestName").exists(),
    body("duration", "Please Enter a duration").exists(),
    body("problems", "Please Enter a problems's id").exists(),
], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let success = false;
    try {
        let error = validationResult(req);
        if (!error.isEmpty()) {
            return res.status(404).send({ success, error: error.array() });
        }
        let { contestName, duration, problems, } = req.body;
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
                problems,
            },
        });
        console.log(result);
        const response2 = yield fetch(`${ServerUrl}/api/contest/leaderboard/create/${result.id}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" }
        });
        // notify all user
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
router.post("/getallcontest", [], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let success = false;
    try {
        let result = yield prisma.contest.findMany({
            select: {
                id: true,
                contestNo: true,
                contestName: true,
                duration: true,
                startTime: true,
                problems: true
            },
        });
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
        result = yield prisma.leaderBoard.create({
            data: {
                contestid,
            }
        });
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
router.put("/leaderboard/update/:contestid", [
    body("problemid", "Please enter the problem id").exists(),
    body("userid", "Please enter the userid").exists(),
    body("startTime", "Please enter the startTime").exists(),
    body("duration", "Please enter the duration").exists()
], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let success = false;
    try {
        let error = validationResult(req);
        if (!error.isEmpty()) {
            return res.status(404).send({ success, error: error.array() });
        }
        const { problemid, userid, startTime, duration } = req.body;
        const { contestid } = req.params;
        if (!problemid || !userid || !contestid || !startTime || !duration) {
            return res.send({ success, msg: "Paramater missing" });
        }
        const response1 = yield prisma.leaderBoard.findFirst({ where: { contestid } });
        console.log(response1);
        if (!response1)
            return res.send({ success, msg: "Contest not exist" });
        const startDate = new Date(startTime);
        const durationMs = duration * 60 * 1000;
        const endDate = new Date(startDate.getTime() + durationMs);
        const remainingTime = endDate.getTime() - Date.now();
        if (remainingTime < 0) {
            return res.send({ success, msg: "Contest Ended" });
        }
        else {
            console.log(`Remaining time: ${remainingTime / 1000} seconds`);
        }
        const response2 = yield prisma.user.findFirst({ where: { id: userid } });
        if (!response2)
            return res.send({ success, msg: "User not exist" });
        const response3 = yield prisma.contestProblem.findFirst({ where: { id: problemid } });
        if (!response3)
            return res.send({ success, msg: "ContestProblem not exist" });
        console.log(response1);
        let UpdateleaderBoard = response1;
        let flag = 0;
        console.log("first - ", UpdateleaderBoard);
        let check1 = UpdateleaderBoard.participent;
        check1.map((e) => {
            console.log(e);
            if (e.userid === userid) {
                flag = 1;
                console.log("hello");
                let c = e.solvedProblem.includes(problemid);
                if (!c)
                    e.solvedProblem = [...e.solvedProblem, problemid];
            }
            return e;
        });
        if (flag === 0) { // if userid not found
            console.log("yellow");
            UpdateleaderBoard.participent = [...UpdateleaderBoard.participent, { userid: userid, solvedProblem: [problemid] }];
        }
        console.log(UpdateleaderBoard.participent);
        const result = yield prisma.leaderBoard.update({ where: {
                id: UpdateleaderBoard.id
            },
            data: {
                participent: UpdateleaderBoard.participent
            }
        });
        success = true;
        res.send({ success, msg: "Done" });
    }
    catch (error) {
        console.log(error);
        return res.status(500).send({ success, error });
    }
}));
router.get("/leaderboard/:contestid", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let success = false;
    try {
        let error = validationResult(req);
        if (!error.isEmpty()) {
            return res.status(404).send({ success, error: error.array() });
        }
        const { contestid } = req.params;
        if (!contestid) {
            return res.send({ success, msg: "Paramater missing" });
        }
        const response1 = yield prisma.leaderBoard.findFirst({ where: { contestid } });
        console.log(response1);
        if (!response1)
            return res.send({ success, msg: "Leaderboard not exist" });
        success = true;
        res.send({ success, msg: "Done", result: response1 });
    }
    catch (error) {
        console.log(error);
        return res.status(500).send({ success, error });
    }
}));
router.put("/usercontestdetail/update/:contestid", [
    body("problemid", "Please enter the problem id").exists(),
    body("userid", "Please enter the userid").exists(),
], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let success = false;
    try {
        let error = validationResult(req);
        if (!error.isEmpty()) {
            return res.status(404).send({ success, error: error.array() });
        }
        const { problemid, userid } = req.body;
        const { contestid } = req.params;
        if (!problemid || !userid || !contestid) {
            return res.send({ success, msg: "Paramater missing" });
        }
        const response1 = yield prisma.leaderBoard.findFirst({ where: { contestid } });
        console.log(response1);
        if (!response1)
            return res.send({ success, msg: "Contest not exist" });
        const response2 = yield prisma.user.findFirst({ where: { id: userid } });
        if (!response2)
            return res.send({ success, msg: "User not exist" });
        const response3 = yield prisma.contestProblem.findFirst({ where: { id: problemid } });
        if (!response3)
            return res.send({ success, msg: "ContestProblem not exist" });
        console.log(response2);
        let UpdateUser = response2;
        let flag = 0;
        console.log("first - ", UpdateUser);
        let check1 = UpdateUser.ContestDetail;
        check1.map((e) => {
            console.log(e);
            if (e.contestid === contestid) {
                flag = 1;
                console.log("hello");
                let c = e.solvedProblem.includes(problemid);
                if (!c)
                    e.solvedProblem = [...e.solvedProblem, problemid];
            }
            return e;
        });
        if (flag === 0) { // if userid not found
            console.log("yellow");
            UpdateUser.ContestDetail = [...UpdateUser.ContestDetail, { contestid: contestid, solvedProblem: [problemid] }];
        }
        console.log(UpdateUser.ContestDetail);
        const result = yield prisma.user.update({ where: {
                id: UpdateUser.id
            },
            data: {
                ContestDetail: UpdateUser.ContestDetail
            }
        });
        success = true;
        res.send({ success, msg: "Done" });
    }
    catch (error) {
        console.log(error);
        return res.status(500).send({ success, error });
    }
}));
router.get("/getcontestrank/:userid", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let success = false;
    try {
        console.log("  - ", req.params.userid);
        const result = yield prisma.leaderBoard.findMany();
        let no = 0;
        result.map((e) => {
            e.participent.map((k) => {
                if (k.userid === req.params.userid)
                    no += k.solvedProblem.length;
            });
        });
        success = true;
        res.send({ success, msg: "Done", result: (1000 + no * 50) });
    }
    catch (error) {
        console.log(error);
        return res.status(500).send({ success, error });
    }
}));
module.exports = router;
