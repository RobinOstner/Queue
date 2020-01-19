const util = require("../../util/");
const config = require("../../config");

const querystring = require("querystring");
const express = require("express");
const { DBConnection } = require("../../extern/mongo/dbConnection.js");
const queueDB = require("../../extern/mongo/queueDB");

const router = express.Router();

router.post("/createQueue", async (req, res) => {
  var foundUniqueKey = false;
  while (!foundUniqueKey) {
    var queueID = util.generateNewQueueID();
    foundUniqueKey = ! await queueDB.queueExists(queueID);
  }

  var queue = {
    queueID,
    tracks: []
  }

  queueDB.createQueue(queue);

  res.status(201).json({
    id: queueID
  });
});

router.delete("/closeQueue", async (req, res) => {
  res.send();
  var id = parseInt(req.query.id);

  queueDB.closeQueue(id);
});

router.get("/queueAll", async (req, res) => {
  res.send(loadQueuesCollection().toArray());
});

router.post("/addTrack", async (req, res) => {
  var queueID = parseInt(req.body.queueID);

  var queue = await queueDB.queueExists(queueID);

  if (!queue) {
    res.status(404).send({
      message: "Invalid Queue ID!"
    });
  }

  var track = req.body.track;
  track.votes = 1;

  var trackExists = false;

  queue.tracks.some(item => {
    if (item.id === track.id) {
      trackExists = true;
      return true;
    }
  });

  if (trackExists) {
    await queueDB.voteTrack(queueID, req.body.track.id);
    res.send();
    return;
  }

  // TODO: Verify Track has needed Information
  await queueDB.addTrack(queueID, track);

  res.send();
});

router.get("/getTracks", async (req, res) => {
  var queueID = parseInt(req.query.queueID);

  var queue = await queueDB.queueExists(queueID);

  if (!queue) {
    res.status(404).send({
      message: "Invalid Queue ID!"
    });
  }

  var tracks = queue.tracks;

  tracks.sort(function (a, b) {
    if (a.votes < b.votes) return 1;
    if (a.votes > b.votes) return -1;
    return 0;
  });

  var limit = parseInt(req.query.limit) || 20;
  var offset = parseInt(req.query.offset) || 0;

  var paginatedTracks = tracks.slice(offset).slice(0, limit);

  var next =
    paginatedTracks.length < limit
      ? null
      : config.serverURL +
        "api/queue/getTracks?" +
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
});

router.put("/voteTrack", async (req, res) => {
  var queueID = parseInt(req.query.queueID);
  var trackID = req.query.trackID;

  await queueDB.voteTrack(queueID, trackID);

  res.send();
});

router.put("/unvoteTrack", async (req, res) => {
  var queueID = parseInt(req.query.queueID);
  var trackID = req.query.trackID;

  await queueDB.unvoteTrack(queueID, trackID);

  
  var track = await queueDB.getTrack(queueID, trackID);

  console.log(track);

  if (track.votes == 0) {
    console.log("Remove Track");
  }
  res.send();
})

async function loadQueuesCollection() {
  const client = await DBConnection.connect();
  return client.db("queue").collection("queues");
}

module.exports = router;
