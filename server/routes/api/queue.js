const util = require("../../util/");
const config = require('../../config');

const querystring = require("querystring");
const express = require("express");
const mongodb = require("mongodb");

const router = express.Router();

router.post('/createQueue', (req, res) => {
  var queueID = util.generateNewQueueID();

  res.status(201).json({
    id: queueID,
  });
});

router.put('/closeQueue', (req, res) => {
  res.send();
});

module.exports = router;