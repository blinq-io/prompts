# Prompts javascript/node client

JavaScript/Node client for caching and storing prompt/response data while utilizing the OpenAI API.

## How to install

`npm install prompt-eng`

## How to use:
### Your code today
```javascript
const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const response = await openai.createCompletion({
  model: "text-davinci-003",
  prompt: "You: How do I combine arrays?\nJavaScript chatbot: You can use the concat() method.\nYou: How do you make an alert appear after 10 seconds?\nJavaScript chatbot",
  temperature: 0,
  max_tokens: 150,
  top_p: 1.0,
  frequency_penalty: 0.5,
  presence_penalty: 0.0,
  stop: ["You:"],
});
```
### Your code after using the proxy client
```javascript
const { Configuration, OpenAIApi } = require("openai");
const { PromptProxy } = require("prompt-eng");

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new PromptProxy(new OpenAIApi(configuration));

const response = await openai.createCompletion({
  model: "text-davinci-003",
  prompt: "You: How do I combine arrays?\nJavaScript chatbot: You can use the concat() method.\nYou: How do you make an alert appear after 10 seconds?\nJavaScript chatbot",
  temperature: 0,
  max_tokens: 150,
  top_p: 1.0,
  frequency_penalty: 0.5,
  presence_penalty: 0.0,
  stop: ["You:"],
});
```
