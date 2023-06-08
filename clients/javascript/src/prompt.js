require("dotenv").config();
const fs = require("fs");
const md5 = require("md5");
const { Queue } = require("./queue");
const axios = require("axios");

exports.PromptProxy = class PromptProxy {
  openai;
  cache;
  path;
  serverURI;
  MAX_QUEUE_SIZE;
  static isInterval = false;
  static queue = new Queue();

  constructor(openai, path, serverURI, env, MAX_QUEUE_SIZE) {
    this.openai = openai;
    this.cache = {};
    this.serverURI = serverURI ? serverURI : process.env.PROMPT_SRV_URI;
    process.env.NODE_ENV = process.env.NODE_ENV ? process.env.NODE_ENV : env;
    this.MAX_QUEUE_SIZE = MAX_QUEUE_SIZE;

    if (!path) {
      fs.appendFile("cachcePath.json", JSON.stringify({}));
    } else {
      this.path = path;
    }
  }

  _initInterval() {
    if (!PromptProxy.isInterval) {
      PromptProxy.isInterval = true;
      PromptProxy.queue.setQueueInterval(this.MAX_QUEUE_SIZE);
    }
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

  _replacePromptParameters(data, chat) {
    if (!chat) return data;

    const messages = [];
    const parts = data.split("####");
    for (let i = 0; i < parts.length; i++) {
      if (!parts[i].trim()) continue;
      const role = parts[i];
      const prompt = parts[i + 1];
      messages.push({ role, content: prompt.trim() });
      i++;
    }

    return messages;
  }

  async createChatCompletion(props) {
    this._initInterval();
    let propsPos = { ...props, prompt: props.messages };

    props.messages = this._replacePromptParameters(props.messages, true);

    propsPos = { ...propsPos, prompt: props.messages };

    if (process.env.NODE_ENV === "dev") {
      const { hashedCache, hash } = this._getCachePrompt(props.messages);

      if (hashedCache !== null) {
        return hashedCache;
      }
      const res = await this.openai.createChatCompletion({ ...props });

      this._setCachePrompt(props.messages, res.data.choices[0]);

      propsPos = { ...propsPos, response: res.data.choices[0], hash };
      PromptProxy.queue.enqueue({ ...propsPos });
      return res.data.choices[0];
    }

    const res = await this.openai.createChatCompletion({ ...props });

    const hash = md5(JSON.stringify(props.messages));

    propsPos = { ...propsPos, response: res.data.choices[0], hash };
    PromptProxy.queue.enqueue({ ...propsPos });

    return res.data.choices[0];
  }

  async createCompletion(props) {
    this._initInterval();
    let propsPos = { ...props };

    props.prompt = this._replacePromptParameters(props.prompt, false);
    if (process.env.NODE_ENV === "dev") {
      const { hashedCache, hash } = this._getCachePrompt(props.prompt);

      if (hashedCache !== null) {
        return hashedCache;
      }
      const res = await this.openai.createCompletion({ ...props });

      this._setCachePrompt(props.prompt, res.data.choices[0]);

      propsPos = { ...propsPos, response: res.data.choices[0], hash };
      PromptProxy.queue.enqueue({ ...propsPos });
      return res.data.choices[0];
    }

    const res = await this.openai.createCompletion({ ...props });

    const hash = md5(JSON.stringify(props.prompt));
    propsPos = { ...propsPos, response: res.data.choices[0], hash };
    PromptProxy.queue.enqueue({ ...propsPos });
    return res.data.choices[0];
  }
};
