const mongoose = require("mongoose");

const regexSchema = new mongoose.Schema({
  regex: {
    type: String,
    required: true,
  },
  list: {
    type: Array,
    required: true,
  },
  response: {
    type: Array,
    required: true,
  },
});

const Regex = mongoose.model("Regex", regexSchema);

exports.Regex = Regex;
