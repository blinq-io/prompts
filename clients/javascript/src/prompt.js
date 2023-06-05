const { OpenAIApi } = require("openai");
const fs = require("fs");
const md5 = require("md5");

exports.PromptCompletion = class PromptCompletion {
  openai;
  cache;
  path;

  constructor(configuration, path) {
    this.openai = new OpenAIApi(configuration);

    this.cache = {};
    this.path = path;
  }

  _initCache() {
    if (!fs.existsSync(this.path)) {
      throw new Error("The path to the cache isn't correct");
    }

    this.cache = JSON.parse(fs.readFileSync(this.path));
  }

  _getCachePrompt(data) {
    if (Object.keys(this.cache) == 0) {
      this._initCache();
    }

    const hash = md5(JSON.stringify(data));
    if (!this.cache[hash]) {
      return { hashedCache: null, hash };
    }

    return { hashedCache: this.cache[hash], hash };
  }

  _setCachePrompt(data, response) {
    const { hash } = this._getCachePrompt(data);
    this.cache[hash] = response;

    fs.writeFileSync(this.path, JSON.stringify(this.cache));
  }

  async createChatCompletion(props) {
    if (process.env.NODE_ENV === "dev") {
      const { hashedCache } = this._getCachePrompt(props.messages);

      if (hashedCache !== null) {
        return hashedCache;
      }
      const res = await this.openai.createChatCompletion({ ...props });

      this._setCachePrompt(props.messages, res);

      return res.choices[0];
    }

    const res = await this.openai.createChatCompletion({ ...props });
    return res.choices[0];
  }

  async createCompletion(props) {
    if (process.env.NODE_ENV === "dev") {
      const { hashedCache } = this._getCachePrompt(props.prompt);

      if (hashedCache !== null) {
        return hashedCache;
      }
      const res = await this.openai.createCompletion({ ...props });

      this._setCachePrompt(props.prompt, res);

      return res.choices[0];
    }

    const res = await this.openai.createCompletion({ ...props });
    return res.choices[0];
  }
};
