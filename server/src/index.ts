const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const { prismaMain } = require("./test");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient(); 

dotenv.config();  

const app = express();
const PORT = (process.env.PORT as number | undefined) || 8000;

console.log(PORT);

// Middleware to parse JSON
app.use(express.json());

// Add CORS Middleware
app.use(cors());



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

// Route definitions
app.use("/api/user", require("./router/User/index"));
app.use("/api/problemset", require("./router/ProblemSet/index"));
app.use("/api/contest", require("./router/Contest/index"));

// Start server
app.listen(8000, () => {
  console.log(`--> Server running at port 8000`);
});
