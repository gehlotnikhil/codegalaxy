import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import helmet from "helmet";
import { PrismaClient } from "@prisma/client";
  const prisma = new PrismaClient();
const app = express();
const PORT = Number(process.env.PORT) || 8000;
console.log(`Server starting on port: ${PORT}`);
const FRONTEND_URL = process.env.FRONTEND_URL;
// Middleware to parse JSON
app.use(express.json());

// Add Helmet middleware for security (allowing cross-origin resources)
app.use(
  helmet({
    crossOriginOpenerPolicy: { policy: "unsafe-none" },
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

app.use(cors({
  origin:  FRONTEND_URL || "http://localhost:5173",
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
app.listen(PORT,"0.0.0.0", () => {
  console.log(`--> Server running at port ${PORT}`);
});
