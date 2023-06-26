const { Router } = require("express");
const { Prompt } = require("../models/Prompt");
const { Template } = require("../models/Template");

const router = Router();

router.delete("/api/deletePrompt", async (req, res) => {
  const _id = req.body.id;
  const prompt = await Prompt.deleteOne({
    _id,
  });

  if (!prompt) {
    console.log("No prompt was found!");
    return res.send("No prompt was found!");
  }

  res.send(prompt);
});

router.delete("/api/deleteTemplate", async (req, res) => {
  const _id = req.body.id;
  const template = await Template.findOne({
    _id,
  });

  if (!template) {
    console.log("No template was found!");
    return res.send("No template was found!");
  }

  await Prompt.updateMany(
    { _id: { $in: template.promptids } },
    { classified: false }
  );

  await Template.deleteOne({ _id });

  res.send(template);
});

exports.deleteRouter = router;
