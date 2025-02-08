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
    res.send({ success: "Daily New Problem Routing is on" });
});
router.post("/create", [
    (0, express_validator_1.body)("problemName", "Please Enter a problem name").exists(),
    (0, express_validator_1.body)("description", "Please Enter a description ").exists(),
    (0, express_validator_1.body)("companies", "Please Enter a companies ").exists(),
    (0, express_validator_1.body)("testcases", "Please Enter a testcase").exists(),
    (0, express_validator_1.body)("constraint", "Please Enter a constraint").exists(),
    (0, express_validator_1.body)("topic", "Please Enter a topic").exists(),
    (0, express_validator_1.body)("category", "Please Enter a category").exists(),
    (0, express_validator_1.body)("sampleInputOutput", "Please Enter a sampleInputOutput").exists(),
    (0, express_validator_1.body)("aboveCodeTemplate", "Please Enter a aboveCodeTemplate").exists(),
    (0, express_validator_1.body)("middleCode", "Please Enter a middleCode").exists(),
    (0, express_validator_1.body)("correctMiddleCode", "Please Enter a correctMiddleCode").exists(),
    (0, express_validator_1.body)("belowCodeTemplate", "Please Enter a belowCodeTemplate").exists(),
], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let success = false;
    try {
        let error = (0, express_validator_1.validationResult)(req);
        if (!error.isEmpty()) {
            return res.status(404).send({ success, error: error.array(), msg: "Parameter missing" });
        }
        let { problemName, description, companies, testcases, constraint, topic, category, sampleInputOutput, aboveCodeTemplate, belowCodeTemplate, middleCode, correctMiddleCode } = req.body;
        console.log("topic-", topic);
        let t = yield prisma.problemSet.findMany();
        let newNumber = 1;
        if (t.length > 0) {
            console.log(t[t.length - 1].problemNo);
            newNumber = t[t.length - 1].problemNo + 1;
        }
        let result = yield prisma.dailyNewProblem.create({
            data: {
                problemNo: newNumber,
                problemName: problemName,
                description: description,
                companies: companies,
                testcases: testcases,
                constraint: constraint,
                topic: topic,
                category: category,
                sampleInputOutput: sampleInputOutput,
                aboveCodeTemplate: aboveCodeTemplate,
                belowCodeTemplate: belowCodeTemplate,
                middleCode: middleCode,
                correctMiddleCode: correctMiddleCode,
            },
        });
        console.log(result);
        success = true;
        res.send({ success, msg: "Daily new problem created", result });
    }
    catch (error) {
        console.log(error);
        res.send({ success, msg: "Internal Server Error " });
    }
}));
router.delete("/delete", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let success = false;
    try {
        let check1 = yield prisma.dailyNewProblem.findFirst({ where: { problemNo: 1 } });
        if (!check1) {
            return res.send({ success, msg: "Daily new Problem not Exist" });
        }
        let result = yield prisma.dailyNewProblem.deleteMany({
            where: { problemNo: 1 }
        }); // Update the problem numbers for the remaining problems
        yield prisma.problemSet.updateMany({
            where: {
                problemNo: {
                    gt: 1,
                },
            },
            data: {
                problemNo: {
                    decrement: 1, // Decrease the problemNo for each problem after the deleted one
                },
            },
        });
        success = true;
        return res.send({ success, result, msg: "Daily new Problem deleted" });
    }
    catch (error) {
        console.log(error);
        return res.status(500).send({ success, error, msg: "Internal Server Error" });
    }
}));
module.exports = router;
router.post("/push", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let success = false;
    try {
        const getfirst = yield prisma.dailyNewProblem.findFirst({ where: { problemNo: 1 } });
        if (!getfirst) {
            res.send({ success, msg: "Not able to create" });
        }
        if (getfirst) {
            let t = yield prisma.problemSet.findMany();
            let newNumber = 1;
            if (t.length > 0) {
                console.log(t[t.length - 1].problemNo);
                newNumber = t[t.length - 1].problemNo + 1;
            }
            const response2 = yield prisma.problemSet.create({ data: {
                    problemNo: newNumber,
                    problemName: getfirst.problemName,
                    description: getfirst.description,
                    companies: getfirst.companies,
                    Details: { like: [], dislike: [] },
                    testcases: getfirst.testcases,
                    constraint: getfirst.constraint,
                    topic: getfirst.topic,
                    accepted: 0,
                    submission: 0,
                    category: getfirst.category,
                    sampleInputOutput: getfirst.sampleInputOutput,
                    aboveCodeTemplate: getfirst.aboveCodeTemplate,
                    belowCodeTemplate: getfirst.belowCodeTemplate,
                    middleCode: getfirst.middleCode,
                    correctMiddleCode: getfirst.correctMiddleCode,
                } });
            console.log("res2-", response2);
            success = true;
            res.send({ success, msg: "Operation Done" });
        }
    }
    catch (error) {
        console.log(error);
        res.send({ success, msg: "Internal Server Error" });
    }
}));
