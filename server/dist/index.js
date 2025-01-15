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
const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const cors_1 = __importDefault(require("cors"));
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const helmet_1 = __importDefault(require("helmet"));
const app = express();
const PORT = process.env.PORT || 8000;
// Middleware to parse JSON
app.use(express.json());
// Add CORS Middleware
const allowedOrigins = [
    'http://localhost:5173', // Frontend for local development
    'https://codegalaxy1.vercel.app/' // Deployed production frontend
];
// Custom CORS configuration
const corsOptions = {
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true); // Allow the request
        }
        else {
            callback(new Error('Not allowed by CORS')); // Reject the request
        }
    },
};
app.use((0, cors_1.default)(corsOptions));
// Root route
app.get("/", (req, res) => {
    res.send({ success: true });
});
// Test route
app.get("/test", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const test1 = yield prisma.testing.create({
        data: {
            email: "nikhil.doe@example.com",
            title: "Hello World",
        },
    });
    console.log("Test created:", test1);
    res.send({ success: true });
}));
// Add Helmet Middleware
app.use((0, helmet_1.default)({
    crossOriginOpenerPolicy: { policy: 'unsafe-none' }, // Set COOP to "unsafe-none"
}));
// Route definitions
app.use("/api/user", require("./router/User/index"));
app.use("/api/problemset", require("./router/ProblemSet/index"));
app.use("/api/contest", require("./router/Contest/index"));
// Start server
app.listen(PORT, () => {
    console.log(`--> Server running at port 8000`);
});
