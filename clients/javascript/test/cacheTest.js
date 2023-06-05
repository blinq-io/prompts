const { PromptCompletion } = require("../src/prompt");
const { Configuration } = require("openai");
const fs = require("fs");
const { expect } = require("chai");

//const config = JSON.parse(fs.readFileSync("./config.json", "utf8"));
const confAI = new Configuration({
  apiKey: "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",
});
describe("cache checking", () => {
  it("check if config runs", () => {
    const prompt = new PromptCompletion(confAI);

    console.log(prompt._getCachePrompt("asdasd"));
  });
  it("save to cache", async () => {
    const prompt = new PromptCompletion(confAI);
    prompt._setCachePrompt("data4\57", "response");
  });

  /*it("saves on dev", async () => {
    const prompt = new PromptCompletion(confAI);
    prompt._initCache();
    await prompt.createChatCompletion({ messages: "datdata" });
  });*/

  it("md5 fix", async () => {
    const prompt = new PromptCompletion(confAI, "../../../cachingData.json");

    await prompt.createCompletion({
      model: "text-davinci-003",
      prompt: "Say this is a test",
      max_tokens: 7,
      temperature: 0,
      top_p: 1,
      n: 1,
      stream: false,
      logprobs: null,
      stop: "\n",
    });
  });
});
