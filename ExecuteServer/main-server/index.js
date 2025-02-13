const express = require('express');
const { createClient } = require('redis');
const cors = require("cors")
const app = express();
app.use(express.json());
app.use(cors())
// const client = createClient(); //default url of redis it is taking
    const client = createClient({
      password: process.env.password,
      socket: {
          host: process.env.host,
          port: process.env.port
      }
    })

app.get("/",(req,res)=>{
  res.send({success:true})
})

app.post("/submit", async (req, res) => {
  const {problemId,code,language,clientId,testcases} = req.body;
  console.log(problemId,"\n",code,"\n",language,"\n",clientId)
  try {
    await client.lPush("problems", JSON.stringify({problemId, code, language,  clientId,testcases }));
    // Store in the database
    res.status(200).send("Submission received and stored.");
  } catch (error) {
    console.error("Redis error:", error);
    res.status(500).send("Failed to store submission.");
  }
});
app.listen(5000,()=>{
  console.log("Express-server is running at PORT 5000")
})
async function startServer() {
  try {
    await client.connect();
    console.log("Connected to Redis");
    
  } catch (error) {
    console.error("Failed to connect to Redis", error);
  }
}

startServer();
