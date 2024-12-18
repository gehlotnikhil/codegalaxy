const express = require("express");
const dotenv = require("dotenv");
const app = express();
const {prismaMain} = require("./test")
const {PrismaClient} = require("@prisma/client")
const prisma = new PrismaClient()
const cors = require("cors");

dotenv.config();  
const PORT = (process.env.PORT as number|undefined) || 8000 ;

// const prisma = new PrismaClient();
console.log(PORT);
app.use(express.json());
app.use(cors());

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
app.use("/api/user",require("./router/User/index"))
app.use("/api/problemset",require("./router/ProblemSet/index"))
app.use("/api/contest",require("./router/Contest/index"))