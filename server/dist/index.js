"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const app = (0, express_1.default)();
const PORT = Number(process.env.PORT) || 8000;
console.log(`Server starting on port: ${PORT}`);
const FRONTEND_URL = process.env.FRONTEND_URL;
// Middleware to parse JSON
app.use(express_1.default.json());
// Add Helmet middleware for security (allowing cross-origin resources)
app.use((0, helmet_1.default)({
    crossOriginOpenerPolicy: { policy: "unsafe-none" },
    crossOriginResourcePolicy: { policy: "cross-origin" },
}));
app.use((0, cors_1.default)({
    origin: FRONTEND_URL || "http://localhost:5173",
    credentials: true
}));
// Root route
app.get("/", (req, res) => {
    res.send({ success: true });
});
// Route definitions
app.use("/api/user", require("./router/User/index"));
app.use("/api/problemset", require("./router/ProblemSet/index"));
app.use("/api/contest", require("./router/Contest/index"));
app.use("/api/dailynewproblem", require("./router/DailyNewProblem"));
app.use("/api/contestproblem", require("./router/ContestProblem"));
app.use("/api/onetoonecompete", require("./router/OneToOneCompete"));
// Start server
app.listen(PORT, "0.0.0.0", () => {
    console.log(`--> Server running at port ${PORT}`);
});
