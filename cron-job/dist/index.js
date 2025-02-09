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
const cron = require("node-cron");
// Schedule the job to run at 12:00 AM daily
const ServerUrl = process.env.ServerUrl || "http://localhost:8000";
cron.schedule("28 14 * * *", () => __awaiter(void 0, void 0, void 0, function* () {
    let result = yield fetch(`${ServerUrl}/api/dailynewproblem/delete`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
    });
    let jsondata = yield result.json();
    console.log(jsondata);
    // Your task (e.g., send notifications, update DB)
}));
