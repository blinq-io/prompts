require("dotenv").config();
const { OpenAIApi } = require("openai");
const fs = require("fs");
const md5 = require("md5");
const { Queue } = require("./queue");
const axios = require("axios");

exports.PromptCompletion = class PromptCompletion {
  openai;
  cache;
  path;
  serverURI;
  static isInterval = false;
  static queue = new Queue();

  constructor(configuration, path, serverURI) {
    this.openai = new OpenAIApi(configuration);
    this.cache = {};
    this.path = path;
    this.serverURI = serverURI
      ? serverURI
      : process.env.PROMPT_SRV_URI
      ? process.env.PROMPT_SRV_URI
      : "http://localhost:3000";
  }

  _initInterval() {
    if (!PromptCompletion.isInterval) {
      PromptCompletion.isInterval = true;
      setInterval(async () => {
        try {
          if (!PromptCompletion.queue.isEmpty) {
            await axios.post(`${this.serverURI}/api/createPrompt`, {
              ...PromptCompletion.queue.dequeue(),
            });
          }
        } catch (error) {
          if (PromptCompletion.queue.length >= 100) {
            while (PromptCompletion.queue >= 100) {
              PromptCompletion.queue.dequeue();
            }
          }
          console.log("Can't access server!");
        }
      }, 2000);
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

  _replacePromptParameters(data, parameters, chat) {
    if (parameters !== undefined) {
      for (const key in parameters) {
        const value = parameters[key];
        data = data.replaceAll(`{${key}}`, value);
      }
    }

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

    props.messages = this._replacePromptParameters(
      props.messages,
      props.parameters,
      true
    );
    delete props.parameters;

    propsPos = { ...propsPos, prompt: props.messages };

    if (process.env.NODE_ENV === "dev") {
      const { hashedCache, hash } = this._getCachePrompt(props.messages);

      if (hashedCache !== null) {
        return hashedCache;
      }
      const res = await this.openai.createChatCompletion({ ...props });

      this._setCachePrompt(props.messages, res.data.choices[0]);

      propsPos = { ...propsPos, response: res.data.choices[0], hash };
      PromptCompletion.queue.enqueue({ ...propsPos });
      return res.data.choices[0];
    }

    const res = await this.openai.createChatCompletion({ ...props });

    const hash = md5(JSON.stringify(props.messages));

    propsPos = { ...propsPos, response: res.data.choices[0], hash };
    PromptCompletion.queue.enqueue({ ...propsPos });

    return res.data.choices[0];
  }

  async createCompletion(props) {
    this._initInterval();
    let propsPos = { ...props };

    props.prompt = this._replacePromptParameters(
      props.prompt,
      props.parameters,
      false
    );
    delete props.parameters;
    if (process.env.NODE_ENV === "dev") {
      const { hashedCache, hash } = this._getCachePrompt(props.prompt);

      if (hashedCache !== null) {
        return hashedCache;
      }
      const res = await this.openai.createCompletion({ ...props });

      this._setCachePrompt(props.prompt, res.data.choices[0]);

      propsPos = { ...propsPos, response: res.data.choices[0], hash };
      PromptCompletion.queue.enqueue({ ...propsPos });
      return res.data.choices[0];
    }

    const res = await this.openai.createCompletion({ ...props });

    const hash = md5(JSON.stringify(props.prompt));
    propsPos = { ...propsPos, response: res.data.choices[0], hash };
    PromptCompletion.queue.enqueue({ ...propsPos });
    return res.data.choices[0];
  }
};
