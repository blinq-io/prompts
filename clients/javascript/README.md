# Prompts

Tool for prompt caching openai gpt responses. It will store your prompt template as well as parameters *In dev environment*in local cache and use it next time you send the same request.

# How to install

`npm install prompt-eng`

# How to use:

- Require the package and take out the `PromptCompletion` class, and initilize it with `new` keyword.
- `PromptCompletion` takes 2 parameters:
  - configuration - the configuration of your openai key.
  - path - the path where your JSON file is being saved (for example: ./src/cache.json).
- The main 2 functions of `PromptCompletion` are the same `createCompletion` and `createChatCompletion` functions in openai, which takes the same parameters, that after use the response is being save to the cache.
