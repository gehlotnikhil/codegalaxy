import {Request,Response,Router} from "express"
const router = Router()
router.get("/",(req:Request,res:Response)=>{
    res.send({success:"ProblemSet Routing is on"})
})




module.exports=router;