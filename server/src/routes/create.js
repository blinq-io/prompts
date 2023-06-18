const { Prompt } = require("../models/Prompt");
const { Template } = require("../models/Template");
const { Router } = require("express");

const router = Router();

router.post("/api/createPrompt", async (req, res) => {
  const { hash } = req.body;
  const isExist = await Prompt.findOne({ hash });

  if (isExist) {
    console.log(
      "A prompt with this hash already exists, try updating instead!"
    );
    return res.send(
      "A prompt with this hash already exists, try updating instead!"
    );
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
    prompt: prompt.prompt,
    response: prompt.response,
  });

  await templateModel.save();

  prompt.classified = true;
  await prompt.save();

  res.send(templateModel);
});

exports.createRouter = router;
