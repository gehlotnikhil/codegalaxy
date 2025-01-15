const dotenv = require("dotenv");
dotenv.config();  
const express = require("express");
import cors, { CorsOptions } from 'cors';
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient(); 
import helmet from 'helmet';

const app = express();
const PORT = (process.env.PORT as number | undefined) || 8000;


// Middleware to parse JSON
app.use(express.json());

// Add CORS Middleware
const allowedOrigins = [
  'http://localhost:5173', // Frontend for local development
  'https://codegalaxy1.vercel.app/'  // Deployed production frontend
 
];

// Custom CORS configuration
const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true); // Allow the request
    } else {
      callback(new Error('Not allowed by CORS')); // Reject the request
    }
  },
};

app.use(cors(corsOptions));



// Root route
app.get("/", (req: any, res: any) => {
  res.send({ success: true });
});

// Test route
app.get("/test", async (req: any, res: any) => {
  const test1 = await prisma.testing.create({
    data: {
      email: "nikhil.doe@example.com",
      title: "Hello World",
    },
  });

  console.log("Test created:", test1);

  res.send({ success: true });
});


// Add Helmet Middleware
app.use(
  helmet({
    crossOriginOpenerPolicy: { policy: 'unsafe-none' }, // Set COOP to "unsafe-none"
  })
);


// Route definitions
app.use("/api/user", require("./router/User/index"));
app.use("/api/problemset", require("./router/ProblemSet/index"));
app.use("/api/contest", require("./router/Contest/index"));

// Start server
app.listen(PORT, () => {
  console.log(`--> Server running at port 8000`);
});
