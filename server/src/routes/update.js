const { Prompt } = require("../models/Prompt");
const { Router } = require("express");

const router = Router();

router.put("/api/updatePrompt", async (req, res) => {
  const { hash } = req.body;

  const prompt = await Prompt.findOne({ hash });

  if (!prompt) {
    return res.send("No prompt with that hash exists!");
  }

  Object.keys(req.body).map((key) => {
    prompt[key] = req.body[key];
  });

  await prompt.save();
  return res.send(prompt);
});

exports.updateRouter = router;
