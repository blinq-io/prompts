const { Prompt } = require("../models/Prompt");
const { Router } = require("express");

const router = Router();

router.post("/api/getPrompt", async (req, res) => {
  const { hash } = req.body;

  const isExists = await Prompt.findOne({ hash });

  if (!isExists) {
    return res.send("No prompt with that hash exists!");
  }

  return res.send(isExists);
});

exports.getRouter = router;
