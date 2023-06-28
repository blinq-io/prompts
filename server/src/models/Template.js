const mongoose = require("mongoose");

const templateSchema = new mongoose.Schema(
  {
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
    promptids: {
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
    duplicate: {
      type: Boolean,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const versionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  templates: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Template",
    },
  ],
});

templateSchema.pre("save", async function (done, { name, _id }) {
  if (_id) {
    const verExist = await Version.findOne({ name });
    if (!verExist) {
      const version = new Version({
        name,
        templates: [_id],
      });

      await version.save();
    } else {
      verExist.templates.push(_id);
      verExist.markModified("templates");
      await verExist.save();
    }
  }
  done();
});

const Template = mongoose.model("Template", templateSchema);
const Version = mongoose.model("Version", versionSchema);

exports.Template = Template;
exports.Version = Version;
