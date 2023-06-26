const { Prompt } = require("../models/Prompt");
const { Template } = require("../models/Template");
const { Router } = require("express");

const router = Router();

router.post("/api/createPrompt", async (req, res) => {
  const {
    hash,
    prompt: givenPrompt,
    response: givenResponse,
    responseTime: givenResponseTime,
  } = req.body;
  const isExist = await Prompt.findOne({ hash });

  if (isExist) {
    console.log(
      "A prompt with this hash already exists, try updating instead!"
    );
    return res.send(
      "A prompt with this hash already exists, try updating instead!"
    );
  }

  let matchingSizeTemplates;
  if (typeof givenPrompt === "string") {
    matchingSizeTemplates = await Template.find({
      regex: { $size: 1 },
    });
  } else {
    matchingSizeTemplates = await Template.find({
      regex: { $size: givenPrompt.length },
    });
  }

  if (matchingSizeTemplates) {
    let match = false;
    for (const template of matchingSizeTemplates) {
      const { regex, params } = template;
      let regExp,
        regExec,
        groups = {},
        groupsArray = [];

      if (typeof givenPrompt === "string") {
        regExp = new RegExp(regex[0]);
        regExec = regExp.exec(givenPrompt);

        if (regExec !== null) {
          params[0].map((param, index) => {
            groups[param] = regExec[index + 1];
          });
          match = true;

          template.groups.push(groups);
          template.prompt.push(givenPrompt);
          template.response.push(givenResponse);
        }
      } else {
        givenPrompt.map((pmt, index) => {
          regExp = new RegExp(regex[index]);
          regExec = regExp.exec(pmt.content);

          if (regExec !== null) {
            params[index].map((param, index) => {
              groups[param] = regExec[index + 1];
            });
            groupsArray.push(groups);
            groups = {};
          }
        });

        if (givenPrompt.length === groupsArray.length) {
          match = true;
          template.groups = [...template.groups, ...groupsArray];
          template.prompt = [...template.prompt, ...givenPrompt];
          template.response.push(givenResponse);
        }
      }
      if (match) {
        template.statistics.responseTime += Number(givenResponseTime);
        template.statistics.totalTokens +=
          givenResponse.data.usage.total_tokens;
        if (template.statistics.maxResponseTime < givenResponseTime)
          template.statistics.maxResponseTime = Number(givenResponseTime);
        template.statistics.numOfSessions += 1;

        const prompt = new Prompt({ ...req.body, classified: true });
        await prompt.save();

        template.promptids.push(prompt._id);

        template.markModified("statistics");
        template.markModified("promptids");
        await template.save();

        return res.send(prompt);
      }
    }
  }

  const prompt = new Prompt({ ...req.body, classified: false });
  await prompt.save();
  return res.send(prompt);
});

router.post("/api/createTemplate", async (req, res) => {
  const { name, regex, params } = req.body;
  const isExist = await Template.findOne({ name });

  if (isExist) {
    console.log("Template already exists, try updating instead!");
    return res.send("Template already exists, try updating instead!");
  }

  const prompt = await Prompt.find({
    classified: false,
    $expr: {
      $eq: [{ $size: "$prompt" }, regex.length],
    },
  });

  let groups = [];
  let regExp;
  const groupsList = [];
  const promptids = [];
  let flatPrompts = [];
  let responses = [];
  let statistics = {
    responseTime: 0,
    totalTokens: 0,
    maxResponseTime: 0,
    numOfSessions: 0,
  };

  prompt.map(async (prompt) => {
    let flag = true,
      broke = false;

    regex.map((reg, index) => {
      if (flag) {
        regExp = new RegExp(reg);
        if (typeof prompt.prompt === "string") {
          if (regExp.test(prompt.prompt)) {
            regExp = regExp.exec(prompt.prompt);
          } else {
            flag = false;
          }
        } else {
          for (let i = 0; i < prompt.prompt.length; i++) {
            if (regExp.test(prompt.prompt[i].content)) {
              regExp = regExp.exec(prompt.prompt[i].content);
              broke = true;
              break;
            }
          }
          if (!broke) {
            flag = false;
          } else {
            broke = false;
          }
        }
        let group = {};
        params[index].map((param, index) => {
          group[param] = regExp[index + 1];
        });
        groups.push(group);
      }
    });
    if (flag) {
      groupsList.push(...groups);
      groups = [];
      promptids.push(prompt._id);
      responses.push(prompt.response);

      statistics.responseTime += Number(prompt.responseTime);
      statistics.totalTokens += prompt.response.data.usage.total_tokens;
      if (statistics.maxResponseTime < prompt.responseTime)
        statistics.maxResponseTime = Number(prompt.responseTime);
      statistics.numOfSessions += 1;

      if (typeof prompt.prompt === "string") {
        flatPrompts.push(prompt.prompt);
      } else {
        flatPrompts.push(...prompt.prompt);
      }

      prompt.classified = true;
      await prompt.save();
    } else {
      groups = [];
      flag = true;
    }
  });

  const templateModel = new Template({
    name,
    regex,
    groups: groupsList,
    params,
    prompt: flatPrompts,
    promptids,
    response: responses,
    statistics: statistics,
  });

  await templateModel.save();

  res.send(templateModel);
});

router.post("/api/test", async (req, res) => {
  await Prompt.updateMany({}, { classified: false });
  res.send({});
});

exports.createRouter = router;
