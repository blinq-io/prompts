const fs = require("fs");
const equalsCheck = (a, b) => {
    return JSON.stringify(a) === JSON.stringify(b);
  }

const addToFile = async data => {
    // fs.writeFileSync("/home/webiwork-36/projects/ai-qa/electron-app/src/automation/tasks/openai/caching.json", result, "utf-8");
    let fileContents = await fs.readFileSync(`${__dirname}/cachingData.json`,'utf8');
    fileContents = JSON.parse(fileContents);
    fileContents.push(data);
    await fs.writeFileSync(`${__dirname}/cachingData.json`, JSON.stringify(fileContents, null, 2), "utf-8");
  };
  
const checkRequest = async(request)=>{
    let cachingResponse = "";
    console.log(`${__dirname}/caching.json`,"__dirname");
    let fileContents = await fs.readFileSync(`${__dirname}/cachingData.json`,'utf8');
    fileContents = JSON.parse(fileContents);
    fileContents?.map((dt)=>{
       let flagCheck =  equalsCheck(dt.request,request);
       if(flagCheck){
        cachingResponse = dt.response;
       }
    })
    return cachingResponse;
  }
  module.exports =  {checkRequest , addToFile }