const mongoose = require("mongoose");

const promptSchema = new mongoose.Schema({
  model: {
    type: String,
    required: true,
  },
  hash: {
    type: String,
    required: true,
  },
  prompt: {
    type: String,
    required: true,
  },
  parameteres: {
    type: Object,
    required: true,
  },
  response: {
    type: Object,
    required: true,
  },
  suffix: {
    type: String,
  },
  max_tokens: {
    type: Number,
  },
  temperature: {
    type: Number,
  },
  top_p: {
    type: Number,
  },
  n: {
    type: Number,
  },
  stream: {
    type: Boolean,
  },
  logprobs: {
    type: Number,
  },
  echo: {
    type: Boolean,
  },
  stop: {
    type: mongoose.Schema.Types.Mixed,
  },
  presence_penalty: {
    type: Number,
  },
  frequency_penalty: {
    type: Number,
  },
  best_of: {
    type: Number,
  },
  logit_bias: {
    type: Object,
  },
});

const Prompt = mongoose.model("Prompt", promptSchema);

exports.Prompt = Prompt;
