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
//1
let clientId = "3cb6c6b56019717db130949865c7091f";
let clientSecret = "79caf22b6c76651bc39c941615728ab37f8f78acaf61204d35bef61358208626";
//2
// let clientId ="cb2165bd6377e25e8bb6e3e27ed1dcf3"
//   let clientSecret ="35cb67935f0b7469b0d9825f2a34f16e987ad29a3f634c03bbd79c00b5218f55"
//3
// let clientId ="345502c18407a9ab659abc4f94cb0161"
//   let clientSecret ="1983d761dcb61af72af3171356f2b0d8a104d5dbe08ec16228ce66ca0ed8248d"
//4
// let clientId ="ceb8d7514750a4147ffce9a3a3190691"
// let clientSecret ="870220b6e357ee0768b3561207b95491e0225aae58bc169ba11c273df1e3f1ce"
//5
// let clientId ="fe433fd7a361a4a412a4454380ecd54f"
// let clientSecret ="80849acee2f7b865c39c0648264e3dc76c8a55cf3948fab6ff4fb3268d1e1200"
//6
// let clientId ="cb896ba9a94408c20a3bca93d0ef0df1"
// let clientSecret ="a2dddd28fefc644e7872296073a3ad90dd07c2b167f5618c63f45f2bc796a614"
//7
// let clientId ="217d8757f3bb711dc38f5f2d5d61ecd8"
// let clientSecret ="9c0eae78724a15785cee75f5fc80e4ffcb1cabdbe41da51ac88731305bd7dd17"
//8 from 006 
// let clientId ="850b170bd8a43bded95a6e0f5601ff76"
//   let clientSecret ="43bbb4d915d70d9180504f6b6aa95976d744c0c821bbf9aece636896bc8c6732"
// let clientId =process.env.JDOOLE_ID
// let clientSecret =process.env.JDOOLE_SECRET
const execute = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let success = false;
    try {
        let error = validationResult(req.body);
        if (!error.isEmpty()) {
            return res.status(404).send({ success, error: error.array() });
        }
        let { language, code, testcases } = req.body;
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
        let i = 0;
        do {
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
            let e = yield fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });
            const jsondata = yield e.json();
            console.log("Output:", jsondata.output);
            console.log("Execution Time:", jsondata.cpuTime, "seconds");
            console.log("Error:", jsondata.error);
            output.push(jsondata.output);
            cpuTime.push(jsondata.cpuTime);
            err.push(jsondata.error);
            if (testcases.length === 1 && testcases[0].output === "") {
                success = true;
                return res.send({
                    success,
                    result,
                    error: err,
                    output,
                    executionTime: cpuTime,
                });
            }
            if (jsondata.output === testcases[i].output) {
                result.push(true);
            }
            else {
                result.push(false);
            }
            i++;
        } while (i < testcases.length);
        success = true;
        return res.send({
            success,
            result,
            error: err,
            output,
            executionTime: cpuTime,
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).send({ success, error });
    }
});
const executeproblem = { execute };
exports.default = executeproblem;
