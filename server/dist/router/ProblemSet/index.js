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
const express_validator_1 = require("express-validator");
const ExecuteProblem_1 = __importDefault(require("./ExecuteProblem"));
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const router = (0, express_1.Router)();
router.get("/", (req, res) => {
    res.send({ success: "ProblemSet Routing is on" });
});
router.post("/create", [
    (0, express_validator_1.body)("problemName", "Please Enter a problem name").exists(),
    (0, express_validator_1.body)("description", "Please Enter a description ").exists(),
    (0, express_validator_1.body)("companies", "Please Enter a companies ").exists(),
    (0, express_validator_1.body)("like", "Please Enter a like ").exists(),
    (0, express_validator_1.body)("dislike", "Please Enter a dislike").exists(),
    (0, express_validator_1.body)("testcase", "Please Enter a testcase").exists(),
    (0, express_validator_1.body)("constraint", "Please Enter a constraint").exists(),
    (0, express_validator_1.body)("topic", "Please Enter a topic").exists(),
    (0, express_validator_1.body)("accepted", "Please Enter a accepted").exists(),
    (0, express_validator_1.body)("submission", "Please Enter a submission").exists(),
    (0, express_validator_1.body)("status", "Please Enter a status").exists(),
    (0, express_validator_1.body)("category", "Please Enter a category").exists(),
    (0, express_validator_1.body)("sampleInputOutput", "Please Enter a sampleInputOutput").exists(),
    (0, express_validator_1.body)("aboveCodeTemplate", "Please Enter a aboveCodeTemplate").exists(),
    (0, express_validator_1.body)("middleCode", "Please Enter a middleCode").exists(),
    (0, express_validator_1.body)("belowCodeTemplate", "Please Enter a belowCodeTemplate").exists(),
], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let success = false;
    try {
        let error = (0, express_validator_1.validationResult)(req.body);
        if (!error.isEmpty()) {
            return res.status(404).send({ success, error: error.array() });
        }
        let { problemName, description, companies, like, dislike, testcases, constraint, topic, accepted, submission, status, category, sampleInputOutput, aboveCodeTemplate, belowCodeTemplate, middleCode } = req.body;
        console.log("topic-", topic);
        let t = yield prisma.problemSet.findMany();
        let newNumber = 1;
        if (t.length > 0) {
            console.log(t[t.length - 1].problemNo);
            newNumber = t[t.length - 1].problemNo + 1;
        }
        let result = yield prisma.problemSet.create({
            data: {
                problemNo: newNumber,
                problemName: problemName,
                description: description,
                companies: companies,
                like: like,
                dislike: dislike,
                testcases: testcases,
                constraint: constraint,
                topic: topic,
                accepted: accepted,
                submission: submission,
                category: category,
                status: status,
                sampleInputOutput: sampleInputOutput,
                aboveCodeTemplate: aboveCodeTemplate,
                belowCodeTemplate: belowCodeTemplate,
                middleCode: middleCode,
            },
        });
        console.log(result);
        success = true;
        return res.send({ success, body: req.body, msg: "Problem Created" });
    }
    catch (error) {
        console.log(error);
        return res.status(500).send({ success, error });
    }
}));
router.put("/update/:problemno", [
    (0, express_validator_1.body)("problemName", "Please Enter a problem name").exists(),
    (0, express_validator_1.body)("description", "Please Enter a description ").exists(),
    (0, express_validator_1.body)("companies", "Please Enter a companies ").exists(),
    (0, express_validator_1.body)("like", "Please Enter a like ").exists(),
    (0, express_validator_1.body)("dislike", "Please Enter a dislike").exists(),
    (0, express_validator_1.body)("testcase", "Please Enter a testcase").exists(),
    (0, express_validator_1.body)("constraint", "Please Enter a constraint").exists(),
    (0, express_validator_1.body)("topic", "Please Enter a topic").exists(),
    (0, express_validator_1.body)("accepted", "Please Enter a accepted").exists(),
    (0, express_validator_1.body)("category", "Please Enter a category").exists(),
    (0, express_validator_1.body)("submission", "Please Enter a submission").exists(),
    (0, express_validator_1.body)("status", "Please Enter a status").exists(),
    (0, express_validator_1.body)("sampleInputOutput", "Please Enter a sampleInputOutput").exists(),
    (0, express_validator_1.body)("aboveCodeTemplate", "Please Enter a aboveCodeTemplate").exists(),
    (0, express_validator_1.body)("belowCodeTemplate", "Please Enter a belowCodeTemplate").exists(),
    (0, express_validator_1.body)("middleCode", "Please Enter a middleCode").exists(),
], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let success = false;
    try {
        let error = (0, express_validator_1.validationResult)(req.body);
        if (!error.isEmpty()) {
            return res.status(404).send({ success, error: error.array() });
        }
        let query = {};
        if (req.body.problemName) {
            query.problemName = req.body.problemName;
        }
        if (req.body.description) {
            query.description = req.body.description;
        }
        if (req.body.companies) {
            query.companies = req.body.companies;
        }
        if (req.body.like) {
            query.like = req.body.like;
        }
        if (req.body.dislike) {
            query.dislike = req.body.dislike;
        }
        if (req.body.testcases) {
            query.testcases = req.body.testcases;
        }
        if (req.body.constraint) {
            query.constraint = req.body.constraint;
        }
        if (req.body.topic) {
            query.topic = req.body.topic;
        }
        if (req.body.accepted) {
            query.accepted = req.body.accepted;
        }
        if (req.body.category) {
            query.category = req.body.category;
        }
        if (req.body.submission) {
            query.submission = req.body.submission;
        }
        if (req.body.status) {
            query.status = req.body.status;
        }
        if (req.body.sampleInputOutput) {
            query.sampleInputOutput = req.body.sampleInputOutput;
        }
        if (req.body.aboveCodeTemplate) {
            query.aboveCodeTemplate = req.body.aboveCodeTemplate;
        }
        if (req.body.belowCodeTemplate) {
            query.belowCodeTemplate = req.body.belowCodeTemplate;
        }
        if (req.body.middleCode) {
            query.middleCode = req.body.middleCode;
        }
        if (Object.keys(query).length === 0) {
            return res.send({ success, msg: "Empty Content" });
        }
        let result = yield prisma.problemSet.update({
            where: { problemNo: Number.parseInt(req.params.problemno) }, data: Object.assign({}, query)
        });
        success = true;
        return res.send({ success, result, msg: "Update Successfull" });
    }
    catch (error) {
        console.log(error);
        return res.status(500).send({ success, error });
    }
}));
router.delete("/delete/:problemno", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let success = false;
    try {
        let check1 = yield prisma.problemSet.findFirst({ where: { problemNo: Number.parseInt(req.params.problemno) } });
        if (!check1) {
            return res.send({ success, msg: "Problem not Exist" });
        }
        let result = yield prisma.problemSet.delete({ where: { problemNo: Number.parseInt(req.params.problemno) } });
        // Update the problem numbers for the remaining problems
        yield prisma.problemSet.updateMany({
            where: {
                problemNo: {
                    gt: Number.parseInt(req.params.problemno),
                },
            },
            data: {
                problemNo: {
                    decrement: 1, // Decrease the problemNo for each problem after the deleted one
                },
            },
        });
        success = true;
        return res.send({ success, result, msg: "Problem deleted" });
    }
    catch (error) {
        console.log(error);
        return res.status(500).send({ success, error });
    }
}));
router.get("/getallproblem/:pageno?", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let success = false;
    try {
        console.log(req.params.pageno, "----", typeof req.params.pageno);
        if (req.params.pageno) {
            let result = yield prisma.problemSet.findMany({
                skip: Number(req.params.pageno) === 0 ? 0 : (Number(req.params.pageno) - 1) * 10,
                take: 10
            });
            success = true;
            return res.send({ success, result });
        }
        let result = (yield prisma.problemSet.findMany());
        success = true;
        return res.send({ success, result });
    }
    catch (error) {
        console.log(error);
        return res.status(500).send({ success, error });
    }
}));
router.get("/getproblemdetails/:pageno?", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let success = false;
    try {
        console.log(req.params.pageno, "----", typeof req.params.pageno);
        if (req.params.pageno) {
            let result = yield prisma.problemSet.findMany({
                skip: Number(req.params.pageno) === 0 ? 0 : (Number(req.params.pageno) - 1) * 10,
                take: 10,
                select: {
                    id: true,
                    problemNo: true,
                    problemName: true,
                    accepted: true,
                    submission: true,
                    status: true,
                    category: true,
                    topic: true
                }
            });
            let count = yield prisma.problemSet.count();
            success = true;
            return res.send({ success, result, entireProblemCount: count });
        }
        let result = (yield prisma.problemSet.findMany({
            select: {
                id: true,
                problemNo: true,
                problemName: true,
                accepted: true,
                submission: true,
                status: true,
                category: true,
                topic: true
            }
        }));
        success = true;
        return res.send({ success, result });
    }
    catch (error) {
        console.log(error);
        return res.status(500).send({ success, error });
    }
}));
router.get("/getspecificproblem", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let success = false;
    try {
        const { id, no } = req.query;
        if (!id && !no) {
            return res.send({ success, msg: "Please enter a valid id or no" });
        }
        console.log(id, "-----", no);
        let result;
        if (id) {
            result = yield prisma.problemSet.findFirst({ where: { id: id } });
        }
        if (no) {
            result = yield prisma.problemSet.findFirst({ where: { problemNo: Number.parseInt(no) } });
        }
        if (result === null) {
            success = false;
        }
        else {
            success = true;
        }
        return res.send({ success, result });
    }
    catch (error) {
        console.log(error);
        return res.status(500).send({ success, error });
    }
}));
router.post("/executeproblem", [
    (0, express_validator_1.body)("testcase", "Please enter a testcases").exists(),
    (0, express_validator_1.body)("language", "Please enter a language").exists(),
    (0, express_validator_1.body)("code", "Please enter a code").exists(),
], ExecuteProblem_1.default.execute);
module.exports = router;
