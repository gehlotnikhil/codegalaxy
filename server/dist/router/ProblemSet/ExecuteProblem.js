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
const axios = require("axios");
const { body, validationResult } = require("express-validator");
let url = "https://api.jdoodle.com/v1/execute";
// let clientId = "3cb6c6b56019717db130949865c7091f";
// let clientSecret =
//   "79caf22b6c76651bc39c941615728ab37f8f78acaf61204d35bef61358208626";
let clientId = "ceb8d7514750a4147ffce9a3a3190691";
let clientSecret = "870220b6e357ee0768b3561207b95491e0225aae58bc169ba11c273df1e3f1ce";
const execute = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let success = false;
    try {
        let error = validationResult(req.body);
        if (!error.isEmpty()) {
            return res.status(404).send({ success, error: error.array() });
        }
        let { problemNo, language, code, testcases } = req.body;
        let result = [];
        let output = [];
        let err = [];
        let cpuTime = [];
        let script = code;
        let versionIndex = "";
        if (language === "java") {
            versionIndex = "4";
        }
        else {
            versionIndex = "0";
        }
        for (let i = 0; i < testcases.length; i++) {
            let stdin = testcases[i].input;
            console.log("input--" + stdin);
            const payload = {
                clientId,
                clientSecret,
                script,
                stdin,
                language,
                versionIndex,
            };
            console.log("io---", payload);
            let e = yield axios.post(url, payload, {
                headers: { "Content-Type": "application/json" },
            });
            console.log("Output:", e.data.output);
            console.log("Execution Time:", e.data.cpuTime, "seconds");
            console.log("Memory Used:", e.data.memory, "KB");
            output.push(e.data.output);
            cpuTime.push(e.data.cpuTime);
            err.push(e.data.error);
            if (e.data.output === testcases[i].output) {
                result.push(true);
            }
            else {
                result.push(false);
            }
        }
        success = true;
        return res.send({ success, result, error: err, output, executionTime: cpuTime });
    }
    catch (error) {
        console.log(error);
        return res.status(500).send({ success, error });
    }
});
const executeproblem = { execute };
exports.default = executeproblem;
