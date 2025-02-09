const cron = require("node-cron");
// Schedule the job to run at 12:00 AM daily
const  ServerUrl =  process.env.ServerUrl||"http://localhost:8000"
cron.schedule("* * * * *", async() => {
    let result = await fetch(`${ServerUrl}/api/dailynewproblem/delete`,{
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
    })
    let jsondata = await result.json()
    console.log(jsondata);
    
    // Your task (e.g., send notifications, update DB)
});
