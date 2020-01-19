const express = require("express");

const app = express();

// Middleware
app.use(express.json());
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', "*");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header('Access-Control-Allow-Methods', "GET,PUT,POST,DELETE");
  res.header('Access-Control-Allow-Headers', "Origin,X-Requested-With,Content-Type,Accept,content-type,application/json, x-access-token,Authorization, x-queue-id");
  next();
});

const posts = require("./routes/api/posts");
const auth = require("./routes/api/auth");
const queue = require("./routes/api/queue");
const jwt = require("./routes/api/jwt");

app.use("/api/posts", posts);
app.use("/api/auth", auth);
app.use("/api/queue", queue);
app.use("/api/jwt", jwt)

// Handle production
if (process.env.NODE_ENV == "production") {
  // Static folder
  app.use(express.static(__dirname + "/public"));

  // Handle SPA
  app.get(/.*/, (req, res) => res.sendFile(__dirname + "/public/index.html"));
}

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server listening on ${port}`);
});
