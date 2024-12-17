const express = require("express");
const dotenv = require("dotenv");
const app = express();
const {prismaMain} = require("./test")
const {PrismaClient} = require("@prisma/client")
const prisma = new PrismaClient()
dotenv.config(); 
const PORT = process.env.PORT as number | unknown;

// const prisma = new PrismaClient();
console.log(PORT);
app.use(express.json());
app.get("/",(req:any,res:any)=>{
  res.send({success:true})
})
app.get("/test", async(req: any, res: any) => {
  const test1 = await prisma.testing.create({
    data: {
        email: "nikhil.doe@example.com",
        title: "Hello World",
    },
  },{unique:true});

  console.log("Test created:", test1)

  res.send({ success: true });
});
app.listen(PORT, () => {
  console.log(`--> Server running at port ${PORT}`);
});