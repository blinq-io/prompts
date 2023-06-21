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

        template.markModified("statistics");
        await template.save();

        const prompt = new Prompt({ ...req.body, classified: true });
        await prompt.save();
        return res.send(prompt);
      }
    }
  }

  const prompt = new Prompt({ ...req.body, classified: false });
  await prompt.save();
  return res.send(prompt);
});

router.post("/api/createTemplate", async (req, res) => {
  const { name, promptId, regex, params } = req.body;
  const isExist = await Template.findOne({ name });

  if (isExist) {
    console.log("Regex already exists, try updating instead!");
    return res.send("Regex already exists, try updating instead!");
  }

  let groups = {};
  let regExp;
  const prompt = await Prompt.findOne({ _id: promptId });
  const groupsList = [];

  regex.map((reg, index) => {
    regExp = new RegExp(reg);
    if (typeof prompt.prompt === "string") {
      regExp = regExp.exec(prompt.prompt);
    } else {
      for (let i = 0; i < prompt.prompt.length; i++) {
        if (regExp.test(prompt.prompt[i].content)) {
          regExp = regExp.exec(prompt.prompt[i].content);
          break;
        }
      }
    }
    params[index].map((param, index) => {
      groups[param] = regExp[index + 1];
    });
    groupsList.push(groups);
    groups = {};
  });

  const templateModel = new Template({
    name,
    regex,
    groups: groupsList,
    params,
    prompt:
      typeof prompt.prompt === "string" ? [prompt.prompt] : [...prompt.prompt],
    response: [prompt.response],
    statistics: {
      responseTime: Number(prompt.responseTime),
      totalTokens: prompt.response.data.usage.total_tokens,
      maxResponseTime: Number(prompt.responseTime),
      numOfSessions: 1,
    },
  });

  await templateModel.save();

  prompt.classified = true;
  await prompt.save();

  res.send(templateModel);
});

exports.createRouter = router;
