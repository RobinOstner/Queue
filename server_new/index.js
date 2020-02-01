const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv').config();
const cookieParser = require('cookie-parser');

//Connect to db
mongoose.connect(process.env.DB_CONNECT,
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => console.log("Connected to database"))


//Middleware
app.use(express.json());
app.use(cookieParser());

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', "http://localhost:8080");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header('Access-Control-Allow-Methods', "GET,PUT,POST,DELETE");
  res.header('Access-Control-Allow-Headers', "Origin,X-Requested-With,Content-Type,Accept,content-type,application/json, x-access-token,Authorization, x-queue-id");
  next();
});

//Import Routes, Route Middlewares
const authRoute = require('./routes/api/auth');
const queueRoute = require('./routes/api/queue');

app.use("/api/auth", authRoute);
app.use("/api/queue", queueRoute);


const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server listening on ${port}`);
});