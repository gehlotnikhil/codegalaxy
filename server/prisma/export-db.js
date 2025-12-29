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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var client_1 = require("@prisma/client");
var fs = require("fs");
var path = require("path");
var prisma = new client_1.PrismaClient();
function exportDatabase() {
    return __awaiter(this, void 0, void 0, function () {
        var collections, cleanData, _i, collections_1, _a, name_1, collection, result, docs, filePath, err_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 5, 6, 8]);
                    collections = [
                        { name: 'users', collection: 'User' },
                        { name: 'contests', collection: 'Contest' },
                        { name: 'problemSets', collection: 'ProblemSet' },
                        { name: 'practiceProblems', collection: 'PraticeProblem' },
                        { name: 'dailyNewProblems', collection: 'DailyNewProblem' },
                        { name: 'contestProblems', collection: 'ContestProblem' },
                        { name: 'leaderboards', collection: 'LeaderBoard' },
                        { name: 'oneToOneLeaderboards', collection: 'OneToOneCompeteLeaderboard' },
                    ];
                    cleanData = {};
                    _i = 0, collections_1 = collections;
                    _b.label = 1;
                case 1:
                    if (!(_i < collections_1.length)) return [3 /*break*/, 4];
                    _a = collections_1[_i], name_1 = _a.name, collection = _a.collection;
                    return [4 /*yield*/, prisma.$runCommandRaw({
                            find: collection,
                            filter: {}
                        })];
                case 2:
                    result = _b.sent();
                    docs = result.cursor.firstBatch;
                    cleanData[name_1] = docs.map(function (_a) {
                        var _id = _a._id, rest = __rest(_a, ["_id"]);
                        return rest;
                    });
                    _b.label = 3;
                case 3:
                    _i++;
                    return [3 /*break*/, 1];
                case 4:
                    filePath = path.join(__dirname, "../seed-data.json");
                    fs.writeFileSync(filePath, JSON.stringify(cleanData, null, 2));
                    console.log("📦 Database exported to seed-data.json");
                    console.log("   users: ".concat(cleanData.users.length));
                    console.log("   contests: ".concat(cleanData.contests.length));
                    console.log("   problemSets: ".concat(cleanData.problemSets.length));
                    console.log("   practiceProblems: ".concat(cleanData.practiceProblems.length));
                    console.log("   dailyNewProblems: ".concat(cleanData.dailyNewProblems.length));
                    console.log("   contestProblems: ".concat(cleanData.contestProblems.length));
                    console.log("   leaderboards: ".concat(cleanData.leaderboards.length));
                    console.log("   oneToOneLeaderboards: ".concat(cleanData.oneToOneLeaderboards.length));
                    return [3 /*break*/, 8];
                case 5:
                    err_1 = _b.sent();
                    console.error("❌ Export failed", err_1);
                    return [3 /*break*/, 8];
                case 6: return [4 /*yield*/, prisma.$disconnect()];
                case 7:
                    _b.sent();
                    return [7 /*endfinally*/];
                case 8: return [2 /*return*/];
            }
        });
    });
}
exportDatabase();
