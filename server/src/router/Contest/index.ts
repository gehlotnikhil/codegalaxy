import {Request,Response,Router} from "express"
const router = Router()
const {body,validationResult} = require("express-validator")
router.get("/",(req:Request,res:Response)=>{
    res.send({success:"Contest Routing is on"})
})

router.post("/create",[

],async(req:Request,res:Response):Promise<any>=>{
    let success = false;
    try {
        let error = validationResult(req.body)    
        if(!error.isEmpty()){
            return res.status(404).send({success,error:error.array()})
        }
        


        success=true;
        return res.send({success})
    } catch (error) {
        console.log(error);
        return res.status(500).send({success,error})
        
    }
})

router.put("/update",[

],async(req:Request,res:Response):Promise<any>=>{
    let success = false;
    try {
        let error = validationResult(req.body)    
        if(!error.isEmpty()){
            return res.status(404).send({success,error:error.array()})
        }
        


        success=true;
        return res.send({success})
    } catch (error) {
        console.log(error);
        return res.status(500).send({success,error})
        
    }
})
router.delete("/delete",[

],async(req:Request,res:Response):Promise<any>=>{
    let success = false;
    try {
        let error = validationResult(req.body)    
        if(!error.isEmpty()){
            return res.status(404).send({success,error:error.array()})
        }
        


        success=true;
        return res.send({success})
    } catch (error) {
        console.log(error);
        return res.status(500).send({success,error})
        
    }
})

router.get("/getallcontest",[

],async(req:Request,res:Response):Promise<any>=>{
    let success = false;
    try {
        let error = validationResult(req.body)    
        if(!error.isEmpty()){
            return res.status(404).send({success,error:error.array()})
        }
        


        success=true;
        return res.send({success})
    } catch (error) {
        console.log(error);
        return res.status(500).send({success,error})
        
    }
})

module.exports=router;