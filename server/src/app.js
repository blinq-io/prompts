require("express-async-errors");
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { getRouter } = require("./routes/get");
const { updateRouter } = require("./routes/update");
const { createRouter } = require("./routes/create");

const app = express();

app.use(express.json());
app.use(cors());

app.use(getRouter);
app.use(updateRouter);
app.use(createRouter);

const start = async () => {
  await mongoose.connect(process.env.MONGO_URI);

  app.listen(process.env.PORT | 3000, () => {
    console.log("Server is up");
  });
};

start();

exports.app = app;
