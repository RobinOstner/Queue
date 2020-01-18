const util = require("../../util/");
const config = require("../../config");

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

router.delete("/closeQueue", async (req, res) => {
  res.send();
  var id = parseInt(req.query.id);

  var queues = await loadQueuesCollection();

  queues.deleteOne({ queueID: id });
});

router.get("/queueAll", async (req, res) => {
  res.send(loadQueuesCollection().toArray());
});

router.post("/addTrack", async (req, res) => {
  var queueID = parseInt(req.body.queueID);

  var db = await loadQueuesCollection();
  var queue = await db.findOne({ queueID: queueID });

  if (queue) {
    var track = req.body.track;
    track.votes = 1;

    // TODO: Verify Track has needed Information
    await db.updateOne(
      {
        queueID: queueID
      },
      {
        $push: { tracks: track }
      }
    );

    res.send();
  } else {
    res.status(404).send({
      message: "Invalid Queue ID!"
    });
  }
});

router.get("/getTracks", async (req, res) => {
  var queueID = parseInt(req.query.queueID);

  var db = await loadQueuesCollection();
  var queue = await db.findOne({ queueID: queueID });

  if (queue) {
    var tracks = queue.tracks;

    var limit = parseInt(req.query.limit) || 20;
    var offset = parseInt(req.query.offset) || 0;

    var paginatedTracks = tracks.slice(offset).slice(0, limit);

    var next =
      paginatedTracks.length < limit
        ? null
        : config.serverURL +
          "/api/queue/getTracks?" +
          querystring.stringify({
            queueID,
            offset: offset + limit,
            limit
          });

    res.send({
      tracks: paginatedTracks,
      limit,
      offset,
      next,
      total: tracks.length
    });
  } else {
    res.status(404).send({
      message: "Invalid Queue ID!"
    });
  }
});

async function loadQueuesCollection() {
  const client = await DBConnection.connect();
  return client.db("queue").collection("queues");
}

module.exports = router;
