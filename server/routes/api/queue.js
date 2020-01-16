const util = require("../../util/");
const config = require("../../config");

const querystring = require("querystring");
const express = require("express");
const { DBConnection } = require("../../util/dbConnection.js");

const router = express.Router();

router.post("/createQueue", async (req, res) => {
  var queues = await loadQueuesCollection();

  var foundUniqueKey = false;
  while (!foundUniqueKey) {
    var queueID = util.generateNewQueueID();

    var queue = await queues.findOne({ queueID: queueID });

    foundUniqueKey = queue === null;
  }

  queues.insertOne({
    queueID,
    tracks: []
  });

  res.status(201).json({
    id: queueID
  });
});

router.delete("/closeQueue", async (req, res) => {
  res.send();
  var id = parseInt(req.query.id);

  var queues = await loadQueuesCollection();

  queues.deleteOne({queueID: id});
});

router.get("/queueAll", async(req, res) => {
  res.send(loadQueuesCollection().toArray());
});

async function loadQueuesCollection() {
  const client = await DBConnection.connectToMongo();
  return client.db("queue").collection("queues");
}

module.exports = router;
