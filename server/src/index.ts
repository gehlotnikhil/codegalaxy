import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import helmet from "helmet";
import { PrismaClient } from "@prisma/client";
  
// Initialize environment variables and Prisma client
const prisma = new PrismaClient();
const app = express();
const PORT = Number(process.env.PORT) || 8000;
console.log(`Server starting on port: ${PORT}`);
const FRONTEND_URL = process.env.FRONTEND_URL;
// Middleware to parse JSON
app.use(express.json());

const allowedOrigins = [ 
  FRONTEND_URL
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
 
// Add Helmet middleware for security (allowing cross-origin resources)
app.use(
  helmet({
    crossOriginOpenerPolicy: { policy: "unsafe-none" },
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

// Root route
app.get("/", (req, res) => {
  res.send({ success: true });
});

// Test route
app.get("/test", async (req, res) => {
  try {
    const test1 = await prisma.testing.create({
      data: {
        email: "nikhil.doe@example.com",
        title: "Hello World",
      },
    });

    console.log("Test created:", test1);
    res.send({ success: true, data: test1 });
  } catch (error) {
    console.error("Error creating test:", error);
    res.status(500).send({ success: false, message: "Server error" });
  }
});

// Route definitions
app.use("/api/user", require("./router/User/index"));
app.use("/api/problemset", require("./router/ProblemSet/index"));
app.use("/api/contest", require("./router/Contest/index"));
app.use("/api/dailynewproblem", require("./router/DailyNewProblem"));
app.use("/api/contestproblem", require("./router/ContestProblem"));
app.use("/api/onetoonecompete", require("./router/OneToOneCompete"));

// Start server
app.listen(PORT, () => {
  console.log(`--> Server running at port ${PORT}`);
});
