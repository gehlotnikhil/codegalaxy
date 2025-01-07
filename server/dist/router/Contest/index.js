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
const router = (0, express_1.Router)();
const { body, validationResult } = require("express-validator");
router.get("/", (req, res) => {
    res.send({ success: "Contest Routing is on" });
});
router.post("/create", [
    body("contestName", "Please Enter a contestName").exists(),
    body("duration", "Please Enter a duration").exists(),
    body("startTime", "Please Enter a startTime").exists(),
    body("problems", "Please Enter a problems's id").exists(),
    body("status", "Please Enter a status").exists()
], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let success = false;
    try {
        let error = validationResult(req.body);
        if (!error.isEmpty()) {
            return res.status(404).send({ success, error: error.array() });
        }
        let { contestName, duration, startTime, problems, status, noOfParticipated, } = req.body;
        let no = yield prisma.contest.count();
        console.log(no);
        let result = yield prisma.contest.create({
            data: {
                contestNo: no + 1,
                contestName,
                duration,
                startTime: new Date(startTime),
                problems,
                status,
                noOfParticipated: 0,
            },
        });
        console.log(result);
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
            query.problemName = req.body.startTime;
        }
        if (req.body.duration) {
            query.startTime = req.body.duration;
        }
        if (req.body.status) {
            query.status = req.body.status;
        }
        if (req.body.noOfParticipated) {
            query.noOfParticipated = req.body.noOfParticipated;
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
router.get("/getspecificcontest/:contestno", [], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let success = false;
    try {
        let result = yield prisma.contest.findFirst({ where: { contestNo: Number.parseInt(req.params.contestno) } });
        console.log(result);
        success = true;
        return res.send({ success, result });
    }
    catch (error) {
        console.log(error);
        return res.status(500).send({ success, error });
    }
}));
module.exports = router;
