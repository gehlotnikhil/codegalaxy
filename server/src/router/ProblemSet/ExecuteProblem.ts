const axios = require("axios");
const { body, validationResult } = require("express-validator");
import e, { Request, Response } from "express";
let url = "https://api.jdoodle.com/v1/execute";

// let clientId ="3cb6c6b56019717db130949865c7091f"
//   let clientSecret ="79caf22b6c76651bc39c941615728ab37f8f78acaf61204d35bef61358208626"
  // let clientId ="ceb8d7514750a4147ffce9a3a3190691"
  // let clientSecret ="870220b6e357ee0768b3561207b95491e0225aae58bc169ba11c273df1e3f1ce"
  let clientId ="fe433fd7a361a4a412a4454380ecd54f"
  let clientSecret ="80849acee2f7b865c39c0648264e3dc76c8a55cf3948fab6ff4fb3268d1e1200"
  // let clientId ="cb896ba9a94408c20a3bca93d0ef0df1"
  // let clientSecret ="a2dddd28fefc644e7872296073a3ad90dd07c2b167f5618c63f45f2bc796a614"

const execute = async (req: Request, res: Response): Promise<any> => {
  let success = false;
  try {
    let error = validationResult(req.body);
    if (!error.isEmpty()) {
      return res.status(404).send({ success, error: error.array() });
    }
    let { language, code, testcases } = req.body;
    let result = [];
    let output = [];
    let err = [];
    let cpuTime = [];
    let script = code;
    let versionIndex: string | null = "";
    if (language === "java") {
      versionIndex = "4";
    } else {
      versionIndex = "0";
    }
    let i = 0;
    do {
      let stdin = testcases[i].input;
      
      console.log("input--" + stdin);

      const payload = {
        clientId,
        clientSecret,
        script,
        stdin,
        language,
        versionIndex,
      };
      console.log("io---", payload);
      let e = await axios.post(url, payload, {
        headers: { "Content-Type": "application/json" },
      });

      console.log("Output:", e.data.output);
      console.log("Execution Time:", e.data.cpuTime, "seconds");
      console.log("Memory Used:", e.data.memory, "KB");
      output.push(e.data.output);
      cpuTime.push(e.data.cpuTime);
      err.push(e.data.error);

      if(testcases.length===1 && testcases[0].output===""){
        success= true;
        return res.send({
          success,
          result,
          error: err,
          output,
          executionTime: cpuTime,
        });
      }
      if (e.data.output === testcases[i].output) {
        result.push(true);
      } else {
        result.push(false);
      }

      i++;
    } while (i < testcases.length);
    
    success = true;
    return res.send({
      success,
      result,
      error: err,
      output,
      executionTime: cpuTime,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ success, error });
  }
};

const executeproblem = { execute };
export default executeproblem;
