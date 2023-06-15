const { Prompt } = require("../models/Prompt");
const { Regex } = require("../models/Regex");
const { Router } = require("express");

const router = Router();

router.post("/api/createPrompt", async (req, res) => {
  const { hash, prompt: bodyPrompt, response } = req.body;
  const isExist = await Prompt.findOne({ hash });

  if (isExist) {
    console.log(
      "A prompt with this hash already exists, try updating instead!"
    );
    return res.send(
      "A prompt with this hash already exists, try updating instead!"
    );
  }

  let isMatch;
  if (typeof bodyPrompt === "string") {
    isMatch = await Regex.findOne({
      $expr: { $regexMatch: { input: bodyPrompt, regex: "$regex" } },
    });
  } else {
    isMatch = await Regex.findOne({
      $expr: {
        $anyElementTrue: {
          $map: {
            input: bodyPrompt,
            as: "prompt",
            in: {
              $regexMatch: {
                input: "$$prompt.content",
                regex: "$regex",
              },
            },
          },
        },
      },
    });
  }

  if (isMatch) {
    let responseMatch =
      typeof bodyPrompt === "string"
        ? [...isMatch.response, response.data.choices[0].text]
        : [...isMatch.response, response.data.choices[0].message.content];

    const prompt = new Prompt({ ...req.body, classified: true });
    await prompt.save();

    const regex = isMatch.regex;
    const list = [...isMatch.list];
    let index = 1;

    if (typeof bodyPrompt === "string") {
      for (let param in list[0]) {
        const regExp = new RegExp(regex).exec(prompt.prompt)[index];
        index++;
        list[0][param] = [...list[0][param], regExp];
      }
    } else {
      for (let param in list[0]) {
        prompt.prompt.map(({ content }) => {
          const regExp = new RegExp(regex).exec(content)[index];
          list[0][param] = [...list[0][param], regExp];
        });
        index++;
      }
    }

    isMatch.list = list;
    isMatch.markModified("list");
    isMatch.response = responseMatch;
    isMatch.markModified("response");
    await isMatch.save();

    return res.send(prompt);
  }

  const prompt = new Prompt({ ...req.body, classified: false });
  await prompt.save();
  return res.send(prompt);
});

router.post("/api/createRegex", async (req, res) => {
  const { regex, params } = req.body;
  const isExist = await Regex.findOne({ regex });

  if (isExist) {
    console.log("Regex already exists, try updating instead!");
    return res.send("Regex already exists, try updating instead!");
  }

  let list = await Prompt.aggregate([
    { $match: { classified: false } },
    {
      $project: {
        prompt: 1,
        response: 1,
        filteredValues: {
          $cond: {
            if: { $eq: [{ $type: "$prompt" }, "string"] },
            then: { $regexMatch: { input: "$prompt", regex: regex } },
            else: {
              $filter: {
                input: "$prompt",
                as: "obj",
                cond: {
                  $regexMatch: { input: "$$obj.content", regex: regex },
                },
              },
            },
          },
        },
      },
    },
  ]);

  let parameters = {};
  let responseMatch = [];

  params.map((param) => {
    parameters[param] = [];
  });
  list.map((item) => {
    const filtered = item.filteredValues;
    const regexp = new RegExp(regex);

    if (typeof filtered === "object") {
      if (filtered.length > 0) {
        filtered.map(({ content }) => {
          params.map((param, index) => {
            parameters[param] = [
              ...parameters[param],
              regexp.exec(content)[index + 1],
            ];
          });
        });
      }
      responseMatch.push(item.response.data.choices[0].message.content);
    } else if (filtered === true) {
      params.map((param, index) => {
        parameters[param] = [
          ...parameters[param],
          regexp.exec(item.prompt)[index + 1],
        ];
      });
      responseMatch.push(item.response.data.choices[0].text);
    }
  });

  const regexModel = new Regex({
    regex,
    list: parameters,
    response: responseMatch,
  });

  await regexModel.save();

  await Prompt.updateMany(
    { _id: { $in: list.map((item) => item._id) } },
    { classified: true }
  );

  res.send(regexModel);
});

exports.createRouter = router;
