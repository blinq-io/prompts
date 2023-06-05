const { Prompt } = require("../models/Prompt");
const { Router } = require("express");

const router = Router();

router.post("/api/createPrompt", async (req, res) => {
  const { hash } = req.body;
  const isExist = await Prompt.findOne({ hash });

  if (isExist) {
    throw new Error(
      "A prompt with this hash already exists, try updating instead!"
    );
  }

  const prompt = new Prompt({ ...req.body });
  await prompt.save();
  return res.send(prompt);
});

exports.createRouter = router;
