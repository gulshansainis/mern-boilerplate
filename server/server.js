const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const { startChatServer, stopChatServer } = require("./chatServer");
const { populateDB } = require("./data/seed");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 8000;
const chatPort = process.env.CHAT_PORT || 8001;
// start chat server
startChatServer(app, chatPort);

// connect to database
mongoose
  .connect(process.env.DATABASE, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then(() => console.log("database connected"))
  .catch((error) => console.log(error));

// seed database
populateDB();

// middlewares
app.use(morgan("dev"));
app.use(cors());
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send({ message: "Connected" });
});

// routes
app.use("/api", require("./routes"));

const server = app.listen(port, () => {
  console.log(`Server started at ${port}`);
});

// stop server gracefully
process.on("SIGTERM", shutDown);
process.on("SIGINT", shutDown);

function shutDown() {
  // first stop chat server
  stopChatServer();
  // next stop server
  server.close(() => {
    console.log("Stopping server");
    process.exit(0);
  });
}

module.exports = {
  server,
  mongoose,
  stopChatServer,
};
