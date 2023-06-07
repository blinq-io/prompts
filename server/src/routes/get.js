const { Prompt } = require("../models/Prompt");
const { Router } = require("express");

const router = Router();

router.post("/api/getPrompt", async (req, res) => {
  const { hash } = req.body;

  const isExists = await Prompt.findOne({ hash });

  if (!isExists) {
    console.log("No prompt with that hash exists!");
    return res.send("No prompt with that hash exists!");
  }

  return res.send(isExists);
});

router.get("/api/getAllPrompts", async (req, res) => {
  const prompts = await Prompt.find({});
  res.send(prompts);
});

exports.getRouter = router;
