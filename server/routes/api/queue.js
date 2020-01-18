const util = require("../../util/");
const config = require("../../config");
const jwt = require("../../util/token/tokenHandler");

const querystring = require("querystring");
const express = require("express");
const { DBConnection } = require("../../extern/mongo/dbConnection.js");

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

router.post("/joinQueue", async (req, res) => {
  const postData = req.body;
  let queue = {
    "id": postData.queue,
  };

  //ToDo check if queue exists
  queue = true;

  if(!queue) {
    res.status(500).json({error: "Not Authorized"});
  }

  res.send(jwt.createInitialTokenSet())
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
  const client = await DBConnection.connect();
  return client.db("queue").collection("queues");
}

module.exports = router;
