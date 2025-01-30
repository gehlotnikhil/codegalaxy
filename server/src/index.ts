import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors, { CorsOptions } from "cors";
import helmet from "helmet";
import { PrismaClient } from "@prisma/client";
 
// Initialize environment variables and Prisma client
const prisma = new PrismaClient();

const app = express();
const PORT = Number(process.env.PORT) || 8000;
 console.log(process.env.PORT);
 
// Middleware to parse JSON
app.use(express.json());

// Define allowed origins 
const allowedOrigins = [
  "http://localhost:5173", // Frontend for local development
  "https://codegalaxy1.vercel.app", // Deployed production frontend
];  

// Custom CORS configuration
const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true); // Allow the request
    } else {
      callback(new Error("Not allowed by CORS")); // Reject the request
    }
  },
};
 
// Use CORS middleware
app.use(cors(corsOptions));

// Add Helmet middleware for security
app.use(
  helmet({
    crossOriginOpenerPolicy: { policy: "unsafe-none" }, // Set COOP to "unsafe-none"
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

// Start server
app.listen(PORT, () => {
  console.log(`--> Server running at port ${PORT}`);
});
