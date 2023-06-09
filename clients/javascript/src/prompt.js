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
    if (!this.logger) {
      this.logger = console;
    }
    this.openai = openai;
    this.cache = {};
    this.serverURI = serverURI;
    if (env) {
      process.env.NODE_ENV = env;
    }
    this.MAX_QUEUE_SIZE = MAX_QUEUE_SIZE;
    this.isDisabled = isDisabled;
    this._setPath(path);
  }

  _setActive(flag) {
    this.isDisabled = !flag;

    if (flag) {
      this.logger.info("Caching enabled");
      this._initInterval();
    } else {
      this.logger.info("Caching disabled");
      clearInterval(Queue.interval);
    }
  }

  _setPath(path) {
    if (!path && process.env.NODE_ENV === "dev") {
      if (!fs.existsSync("./.prompts_cache.json")) {
        fs.appendFileSync("./.prompts_cache.json", JSON.stringify({}));
      }
      this.path = "./.prompts_cache.json";
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
      this.logger.error("The path to the cache isn't correct", this.path);
      throw new Error("The path to the cache isn't correct " + this.path);
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

    if (process.env.NODE_ENV === "dev" && !this.isDisabled) {
      const { hashedCache, hash } = this._getCachePrompt(props);

      if (hashedCache !== null) {
        return hashedCache;
      }

      const result = await this.openai.createChatCompletion({ ...props });

      this._setCachePrompt(props, {
        status: result.status,
        statusText: result.statusText,
        data: result.data,
      });

      propsPos = { ...propsPos, response: { status, statusText, data }, hash };
      PromptProxy.queue.enqueue({ ...propsPos });
      return result;
    }

    const { status, statusText, data } = await this.openai.createChatCompletion(
      { ...props }
    );

    const hash = md5(JSON.stringify(props.messages));

    propsPos = { ...propsPos, response: { status, statusText, data }, hash };
    PromptProxy.queue.enqueue({ ...propsPos });

    return { status, statusText, data };
  }

  async createCompletion(props) {
    this._initInterval();
    let propsPos = { ...props };

    if (process.env.NODE_ENV === "dev" && !this.isDisabled) {
      const { hashedCache, hash } = this._getCachePrompt(props);

      if (hashedCache !== null) {
        return hashedCache;
      }
      const { status, statusText, data } = await this.openai.createCompletion({
        ...props,
      });

      this._setCachePrompt(props, { status, statusText, data });

      propsPos = { ...propsPos, response: { status, statusText, data }, hash };
      PromptProxy.queue.enqueue({ ...propsPos });
      return { status, statusText, data };
    }

    const { status, statusText, data } = await this.openai.createCompletion({
      ...props,
    });

    const hash = md5(JSON.stringify(props.prompt));
    propsPos = { ...propsPos, response: { status, statusText, data }, hash };
    PromptProxy.queue.enqueue({ ...propsPos });
    return { status, statusText, data };
  }
};
