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
const express_validator_1 = require("express-validator");
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const ServerUrl = process.env.ServerUrl || "http://localhost:8000";
console.log(ServerUrl);
const router = (0, express_1.Router)();
router.get("/", (req, res) => {
    res.send({ success: "Contest Problem Routing is on" });
});
router.post("/create", [
    (0, express_validator_1.body)("problemName", "Please Enter a problem name").exists(),
    (0, express_validator_1.body)("description", "Please Enter a description ").exists(),
    (0, express_validator_1.body)("testcases", "Please Enter a testcases").exists(),
    (0, express_validator_1.body)("topic", "Please Enter a topic").exists(),
    (0, express_validator_1.body)("sampleInputOutput", "Please Enter a sampleInputOutput").exists(),
    (0, express_validator_1.body)("testcases", "Please Enter a testcases").exists(),
    (0, express_validator_1.body)("constraint", "Please Enter a constraint").exists(),
    (0, express_validator_1.body)("aboveCodeTemplate", "Please Enter a aboveCodeTemplate").exists(),
    (0, express_validator_1.body)("middleCode", "Please Enter a middleCode").exists(),
    (0, express_validator_1.body)("correctMiddleCode", "Please Enter a correctMiddleCode").exists(),
    (0, express_validator_1.body)("belowCodeTemplate", "Please Enter a belowCodeTemplate").exists(),
    (0, express_validator_1.body)("createdAt", "Please Enter a createdAt"),
], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let success = false;
    try {
        let error = (0, express_validator_1.validationResult)(req.body);
        if (!error.isEmpty()) {
            return res.status(404).send({ success, error: error.array() });
        }
        let date = null;
        let { problemName, description, testcases, constraint, topic, sampleInputOutput, aboveCodeTemplate, belowCodeTemplate, middleCode, correctMiddleCode, } = req.body;
        console.log("topic-", topic);
        let t = yield prisma.contestProblem.findMany();
        let newNumber = 1;
        if (t.length > 0) {
            console.log(t[t.length - 1].problemNo);
            newNumber = t[t.length - 1].problemNo + 1;
        }
        let result = yield prisma.contestProblem.create({
            data: {
                problemNo: newNumber,
                problemName: problemName,
                description: description,
                topic: topic,
                testcases: testcases,
                constraint: constraint,
                sampleInputOutput: sampleInputOutput,
                aboveCodeTemplate: aboveCodeTemplate,
                belowCodeTemplate: belowCodeTemplate,
                middleCode: middleCode,
                correctMiddleCode: correctMiddleCode,
            },
        });
        console.log(result);
        success = true;
        return res.send({ success, body: req.body, msg: "Contest Problem Created" });
    }
    catch (error) {
        console.log(error);
        return res.status(500).send({ success, error });
    }
}));
router.put("/update/:problemno", [
    (0, express_validator_1.body)("problemName", "Please Enter a problem name").exists(),
    (0, express_validator_1.body)("description", "Please Enter a description ").exists(),
    (0, express_validator_1.body)("topic", "Please Enter a topic").exists(),
    (0, express_validator_1.body)("category", "Please Enter a category").exists(),
    (0, express_validator_1.body)("testcase", "Please Enter a testcase").exists(),
    (0, express_validator_1.body)("constraint", "Please Enter a constraint").exists(),
    (0, express_validator_1.body)("sampleInputOutput", "Please Enter a sampleInputOutput").exists(),
    (0, express_validator_1.body)("aboveCodeTemplate", "Please Enter a aboveCodeTemplate").exists(),
    (0, express_validator_1.body)("belowCodeTemplate", "Please Enter a belowCodeTemplate").exists(),
    (0, express_validator_1.body)("middleCode", "Please Enter a middleCode").exists(),
    (0, express_validator_1.body)("correctMiddleCode", "Please Enter a correctMiddleCode").exists(),
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
        if (req.body.testcases) {
            query.testcases = req.body.testcases;
        }
        if (req.body.constraint) {
            query.constraint = req.body.constraint;
        }
        if (req.body.topic) {
            query.topic = req.body.topic;
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
        if (req.body.correctMiddleCode) {
            query.correctMiddleCode = req.body.correctMiddleCode;
        }
        if (Object.keys(query).length === 0) {
            return res.send({ success, msg: "Empty Content" });
        }
        let result = yield prisma.contestProblem.update({
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
        let check1 = yield prisma.contestProblem.findFirst({ where: { problemNo: Number.parseInt(req.params.problemno) } });
        if (!check1) {
            return res.send({ success, msg: "Contest Problem not Exist" });
        }
        let result = yield prisma.contestProblem.delete({ where: { problemNo: Number.parseInt(req.params.problemno) } });
        // Update the problem numbers for the remaining problems
        yield prisma.contestProblem.updateMany({
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
        return res.send({ success, result, msg: "Contest Problem deleted" });
    }
    catch (error) {
        console.log(error);
        return res.status(500).send({ success, error });
    }
}));
router.post("/getallproblem", [
    (0, express_validator_1.body)("id", "Please Enter a id"),
    (0, express_validator_1.body)("problemName", "Please Enter a problem name"),
    (0, express_validator_1.body)("description", "Please Enter a description "),
    (0, express_validator_1.body)("testcase", "Please Enter a testcase"),
    (0, express_validator_1.body)("constraint", "Please Enter a constraint"),
    (0, express_validator_1.body)("topic", "Please Enter a topic"),
    (0, express_validator_1.body)("sampleInputOutput", "Please Enter a sampleInputOutput"),
    (0, express_validator_1.body)("aboveCodeTemplate", "Please Enter a aboveCodeTemplate"),
    (0, express_validator_1.body)("belowCodeTemplate", "Please Enter a belowCodeTemplate"),
    (0, express_validator_1.body)("middleCode", "Please Enter a middleCode"),
    (0, express_validator_1.body)("correctMiddleCode", "Please Enter a correctMiddleCode")
], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let success = false;
    try {
        let result = {};
        let query = {};
        if (req.body.id) {
            query.id = 1;
        }
        if (req.body.problemName) {
            query.problemName = 1;
        }
        if (req.body.problemNo) {
            query.problemNo = 1;
        }
        if (req.body.description) {
            query.description = 1;
        }
        if (req.body.testcases) {
            query.testcases = 1;
        }
        if (req.body.constraint) {
            query.constraint = 1;
        }
        if (req.body.topic) {
            query.topic = 1;
        }
        if (req.body.category) {
            query.category = 1;
        }
        if (req.body.correctMiddleCode) {
            query.correctMiddleCode = 1;
        }
        if (req.body.sampleInputOutput) {
            query.sampleInputOutput = 1;
        }
        if (req.body.aboveCodeTemplate) {
            query.aboveCodeTemplate = 1;
        }
        if (req.body.belowCodeTemplate) {
            query.belowCodeTemplate = 1;
        }
        if (req.body.middleCode) {
            query.middleCode = 1;
        }
        if (!(Object.keys(query).length === 0))
            result = yield prisma.contestProblem.findMany({ select: Object.assign({}, query) });
        else
            result = yield prisma.contestProblem.findMany();
        success = true;
        return res.send({ success, result });
    }
    catch (error) {
        console.log(error);
        return res.status(500).send({ success, error });
    }
}));
router.post("/getspecificproblem", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let success = false;
    try {
        const { id, no } = req.query;
        if (!id && !no) {
            return res.send({ success, msg: "Please enter a valid id or no" });
        }
        console.log(id, "-----", no);
        let result;
        if (id) {
            result = yield prisma.contestProblem.findFirst({ where: { id: id } });
            console.log("result--", result);
            if (result === null) {
                return res.send({ success, result });
            }
            const token = req.body.token || "";
            if (!token) {
                return res.status(400).send({ success: false, msg: "Token is required" });
            }
            const response = yield fetch(`${ServerUrl}/api/user/tokentodata`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token: (token || "") })
            });
            console.log("final -", result);
        }
        if (no) {
            result = yield prisma.contestProblem.findFirst({ where: { problemNo: Number.parseInt(no) } });
        }
        if (result === null)
            success = false;
        else
            success = true;
        return res.send({ success, result });
    }
    catch (error) {
        console.log(error);
        return res.status(500).send({ success, error });
    }
}));
module.exports = router;
