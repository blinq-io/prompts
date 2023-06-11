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

router.get("/api/getPromptsCount", async (req, res) => {
  const length = await Prompt.countDocuments({});
  res.send(String(length));
});

router.get("/api/getPage", async (req, res) => {
  const pageNum = req.query.page;
  const MAX_PAGES_IN_PAGE = 20;
  const startPage = pageNum * MAX_PAGES_IN_PAGE;

  const prompts = await Prompt.find({})
    .skip(startPage)
    .limit(MAX_PAGES_IN_PAGE);
  return res.send(prompts);
});

exports.getRouter = router;
