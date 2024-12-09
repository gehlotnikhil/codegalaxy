const express = require("express");
const dotenv = require("dotenv");
const app = express();
const {prismaMain} = require("./test")
import { PrismaClient } from "@prisma/client";
dotenv.config(); 
const PORT = process.env.PORT as number | unknown;

const prisma = new PrismaClient();
console.log(PORT);
app.use(express.json());
app.get("/", async(req: any, res: any) => {
  prismaMain()
  .catch((e:any) => {
    console.error(e)
  })
  .finally(async () => await prisma.$disconnect());

  res.send({ success: true });
});
app.listen(PORT, () => {
  console.log(`-Server running at port ${PORT}`);
});