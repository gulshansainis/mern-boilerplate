const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 8000;

// connect to database
mongoose
  .connect(process.env.DATABASE, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then(() => console.log("databse connected"))
  .catch((error) => console.log(error));

// middlewares
app.use(morgan("dev"));
app.use(cors());
app.use(bodyParser.json());

// routes
app.use("/api", require("./routes"));

app.listen(port, () => {
  console.log(`Server started at ${port}`);
});
