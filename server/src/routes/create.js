const { Prompt } = require("../models/Prompt");
const { Regex } = require("../models/Regex");
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

router.post("/api/createRegex", async (req, res) => {
  const { regex } = req.body;
  const isExist = await Regex.findOne({ regex });

  if (isExist) {
    console.log("Regex already exists, try updating instead!");
    return res.send("Regex already exists, try updating instead!");
  }

  let list = await Prompt.aggregate([
    {
      $project: {
        prompt: 1,
        filteredValues: {
          $cond: {
            if: { $eq: ["$classified", false] },
            then: {
              $cond: {
                if: { $eq: [{ $type: "$prompt" }, "string"] },
                then: { $regexMatch: { input: "$prompt", regex: regex } },
                else: {
                  $anyElementTrue: {
                    $map: {
                      input: "$prompt",
                      as: "obj",
                      in: {
                        $regexMatch: { input: "$$obj.content", regex: regex },
                      },
                    },
                  },
                },
              },
            },
            else: false,
          },
        },
      },
    },
  ]);

  list = list.filter((item) => {
    return item.filteredValues === true;
  });

  const regexModel = new Regex({
    regex,
    list,
  });

  await regexModel.save();

  res.send(regexModel);
});

exports.createRouter = router;
