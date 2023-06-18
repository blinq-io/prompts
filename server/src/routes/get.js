const { Prompt } = require("../models/Prompt");
const { Router } = require("express");
const { Template } = require("../models/Template");

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
  const length = await Prompt.countDocuments({ classified: false });
  res.send(String(length));
});

router.get("/api/getTemplateCount", async (req, res) => {
  const length = await Template.countDocuments({});
  res.send(String(length));
});

router.get("/api/getUnclassifedPage", async (req, res) => {
  const pageNum = req.query.page;
  const MAX_PAGES_IN_PAGE = 10;
  const startPage = pageNum * MAX_PAGES_IN_PAGE;

  const prompts = await Prompt.find({ classified: false })
    .skip(startPage)
    .limit(MAX_PAGES_IN_PAGE);
  return res.send(prompts);
});

router.get("/api/getClassifiedPage", async (req, res) => {
  const pageNum = req.query.page;
  const MAX_PAGES_IN_PAGE = 10;
  const startPage = pageNum * MAX_PAGES_IN_PAGE;

  const template = await Template.find({})
    .skip(startPage)
    .limit(MAX_PAGES_IN_PAGE);
  return res.send(template);
});

router.get("/api/getAllTemplate", async (req, res) => {
  const template = await Template.find({});
  res.send(template);
});

exports.getRouter = router;
