const { body, validationResult } = require("express-validator");
import { Request, Response } from "express";
const execute = async (req: Request, res: Response): Promise<any> => {
  let success = false;
  try {
    let error = validationResult(req.body);
    if (!error.isEmpty()) {
      return res.status(404).send({ success, error: error.array() });
    }
    let {problemNo,language,code,testcases} = req.body
    let result = []
    for(let i = 0;i<testcases.length;i++){
      result.push(false)
    }

    console.log(testcases[0]," - ",testcases.length);
    

    success = true;
    return res.send({ success ,result});
  } catch (error) {
    console.log(error);
    return res.status(500).send({ success, error });
  }
};

const executeproblem = { execute };
export default executeproblem