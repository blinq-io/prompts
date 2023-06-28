const { Router } = require("express");
const { Prompt } = require("../models/Prompt");
const { Template, Version } = require("../models/Template");

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
  const name = req.body.name;
  const templates = await Template.find({
    name,
  });

  if (!templates) {
    console.log("No template was found!");
    return res.send("No template was found!");
  }

  templates.map(async (template) => {
    await Prompt.updateMany(
      { _id: { $in: template.promptids } },
      { classified: false }
    );
  });

  await Template.deleteMany({ name });
  await Version.deleteOne({ name });

  res.send(templates);
});

exports.deleteRouter = router;
