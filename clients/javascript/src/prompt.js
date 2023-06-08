require("dotenv").config();
const fs = require("fs");
const md5 = require("md5");
const { Queue } = require("./queue");

exports.PromptProxy = class PromptProxy {
  static isInterval = false;
  static queue = new Queue();

  constructor(
    openai,
    {
      serverURI = process.env.PROMPT_SRV_URI,
      logger,
      path,
      env = process.env.NODE_ENV,
      MAX_QUEUE_SIZE = 100,
      isDisabled = false,
    } = {}
  ) {
    this.logger = logger;
    this.openai = openai;
    this.cache = {};
    this.serverURI = serverURI;
    process.env.NODE_ENV = env;
    this.MAX_QUEUE_SIZE = MAX_QUEUE_SIZE;
    this.isDisabled = isDisabled;
    this._setPath(path);
  }

  _logMessage(message, type) {
    if (type === "error") {
      if (this.logger) {
        this.logger.error(message);
        return;
      }

      console.error(message);
    } else {
      if (this.logger) {
        this.logger.info(message);
        return;
      }
      console.info(message);
    }
  }

  _setActive(flag) {
    this.isDisabled = !flag;

    if (flag) {
      this._logMessage("Caching enabled", "info");
      this._initInterval();
    } else {
      this._logMessage("Caching disabled", "info");
      clearInterval(Queue.interval);
    }
  }

  _setPath(path) {
    if (!path && process.env.NODE_ENV === "dev") {
      if (!fs.existsSync("./cachePath.json")) {
        fs.appendFileSync("cachePath.json", JSON.stringify({}));
      }
      this.path = "./cachePath.json";
    } else {
      this.path = path;
    }
  }

  _initInterval() {
    if (!PromptProxy.isInterval && !this.isDisabled) {
      PromptProxy.isInterval = true;
      Queue.setQueueInterval(PromptProxy, this.serverURI, this.MAX_QUEUE_SIZE);
    }
  }

  _initCache() {
    if (!fs.existsSync(this.path)) {
      this._logMessage("The path to the cache isn't correct", "error");
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
    this._initInterval();
    let propsPos = { ...props, prompt: props.messages };

    propsPos = { ...propsPos, prompt: props.messages };

    if (process.env.NODE_ENV === "dev" && !this.isDisabled) {
      const { hashedCache, hash } = this._getCachePrompt(props.messages);

      if (hashedCache !== null) {
        return hashedCache;
      }
      const { status, statustext, data } =
        await this.openai.createChatCompletion({ ...props });

      this._setCachePrompt(props.messages, status, statustext, data);

      propsPos = { ...propsPos, response: { status, statustext, data }, hash };
      PromptProxy.queue.enqueue({ ...propsPos });
      return { status, statustext, data };
    }

    const { status, statustext, data } = await this.openai.createChatCompletion(
      { ...props }
    );

    const hash = md5(JSON.stringify(props.messages));

    propsPos = { ...propsPos, response: { status, statustext, data }, hash };
    PromptProxy.queue.enqueue({ ...propsPos });

    return { status, statustext, data };
  }

  async createCompletion(props) {
    this._initInterval();
    let propsPos = { ...props };

    if (process.env.NODE_ENV === "dev" && !this.isDisabled) {
      const { hashedCache, hash } = this._getCachePrompt(props.prompt);

      if (hashedCache !== null) {
        return hashedCache;
      }
      const { status, statustext, data } = await this.openai.createCompletion({
        ...props,
      });

      this._setCachePrompt(props.prompt, status, statustext, data);

      propsPos = { ...propsPos, response: { status, statustext, data }, hash };
      PromptProxy.queue.enqueue({ ...propsPos });
      return { status, statustext, data };
    }

    const { status, statustext, data } = await this.openai.createCompletion({
      ...props,
    });

    const hash = md5(JSON.stringify(props.prompt));
    propsPos = { ...propsPos, response: { status, statustext, data }, hash };
    PromptProxy.queue.enqueue({ ...propsPos });
    return { status, statustext, data };
  }
};
