const mongoose = require("mongoose");

const regexSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  regex: {
    type: Array,
    required: true,
  },
  groups: {
    type: Array,
    required: true,
  },
  params: {
    type: Array,
    required: true,
  },
  prompt: {
    type: Array,
    required: true,
  },
  response: {
    type: Array,
    required: true,
  },
  statistics: {
    type: Object,
    required: true,
  },
});

const Template = mongoose.model("Template", regexSchema);

exports.Template = Template;
