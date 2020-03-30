const router = require("express").Router();

const Queue = require("../../model/Queue");
const Track = require("../../model/Track");
const util = require("../../util/index");
const jwtTokenGen = require("../../util/token/tokenHandler");
const jwtTokenCheck = require("../../util/token/tokenChecker");
const crypto = require('crypto')

router.post("/createQueue", async (req, res) => {
  var accessToken = req.body.accessToken;
  var foundUniqueKey = false;
  while (!foundUniqueKey) {
    var queueID = util.generateNewQueueID();
    foundUniqueKey = !(await Queue.findOne({ queueID: queueID }));
  }

  let queueTokenSalt = util.generateRandomString(16);

  const queue = new Queue({
    queueID: queueID,
    tokenSalt: queueTokenSalt,
    accessToken: accessToken,
    password: queueTokenSalt
  });

  try {
    const savedQueue = await queue.save();

    let refreshToken = jwtTokenGen.createRefreshTokenHost(savedQueue.tokenSalt);
    res.cookie("refreshToken", refreshToken, { httpOnly: true, Secure: true });

    res.status(201).send({
      queueID: savedQueue.queueID,
      tracks: savedQueue.tracks,
      token: jwtTokenGen.signHostData(savedQueue.tokenSalt, { queueID: savedQueue.queueID })
    });
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
});

router.get("/queueHasPassword", async (req, res) => {
  var queueID = parseInt(req.query.queueID);

  if(!queueID) {
    return res.send(400);
  }

  var queue = await Queue.findOne({ queueID: queueID });

  if(!queue) {
    return res.sendStatus(404);
  }

  return res.status(200).send( {
    hasPassword : queue.hasPassword()
  });
});

router.post("/setQueuePassword", jwtTokenCheck.hostAccess, async (req, res) => {
  var queueID = parseInt(req.body.queueID);
  var password = req.body.password;

  if(!queueID || !password) {
    return res.send(400);
  }

  var queue = await Queue.findOne({ queueID: queueID });

  if(!queue) {
    return res.send(404);
  }

  let hash = crypto.createHash('md5').update( queue.tokenSalt + queue.tokenSalt + password + queue.tokenSalt).digest("hex");
  queue.password = hash;
  

  await queue.save(function(err, queue) {
    if(err){
      console.log(err);
      return res.status(500).send();
    }

    return res.status(200).send();
  });
});

router.post("/joinQueue", async (req, res) => {
  const queueID = parseInt(req.body.queueID);

  const password = req.body.password;

  Queue.findOne({ queueID: queueID })
    .then(queue => {
      if (!queue) {
        return res.status(404).send({ error: "No queue found" });
      }

      if(queue.hasPassword() && !password){
        return res.status(401).send({ error: "Unauthorized"});
      }

      if(queue.hasPassword() && !queue.checkPassword(password)){
        return res.status(401).send({ error: "Unauthorized"});
      }

      let jwtAccessToken = jwtTokenGen.signClientData(queue.tokenSalt, { queueID: queue.queueID });

      res.cookie("refreshToken", jwtTokenGen.createRefreshTokenClient(queue.tokenSalt), { httpOnly: true, Secure: true });
      res
        .json({
          token: jwtAccessToken,
          accessToken: queue.accessToken
        })
        .send();
    })
    .catch(err => {
      console.log(err);

      res.status(404).send();
    });
});

//ToDo check if actual object id is used or queueID
router.delete("/closeQueue", jwtTokenCheck.hostAccess, async (req, res) => {
  //console.log("Delete queue", req.query.id);
  var id = parseInt(req.query.id);
  Queue.deleteOne({ queueID: id }, function(err) {
    if(err) {
      console.log(err)
      res.status(204).send(err);
    }
  }).then( (result) => {
    res.status(200).send();
  });
});

//ToDo check if needed
router.get("/queueAll", async (req, res) => {
  await Queue.find(
    {},
    (err, queues) => {
      res.send(queues);
    },
    {}
  );
});

router.post("/addTrack", jwtTokenCheck.hostAndClientAccess, async (req, res) => {
  var queueID = parseInt(req.body.queueID);
  var queue = await Queue.findOne({ queueID: queueID });

  if (!queue) {
    return res.status(404).send({
      message: "Invalid Queue ID!"
    });
  }

  var track = Track({
    id: req.body.track.id,
    title: req.body.track.title,
    artist: req.body.track.artist,
    duration: req.body.track.duration,
    coverURL: req.body.track.coverURL,
  });

  var trackExists = false;

  queue.tracks.some(item => {
    if (item.id === track.id) {
      trackExists = true;
      return true;
    }
  });

  if (trackExists) {
    await Queue.findOneAndUpdate(
      {
        queueID: queueID,
        "tracks.id": track.id
      },
      {
        $inc: {
          "tracks.$.votes": 1
        }
      }
    );

    return res.send("Voted up");
  }

  // TODO: Verify Track has needed Information
  queue.tracks.push(track);
  let newQueue = await queue.save();
  res.send(newQueue);
});

router.get("/getTracks", jwtTokenCheck.hostAndClientAccess, async (req, res) => {
  var queueID = parseInt(req.query.queueID);

  var queue = await Queue.findOne({ queueID: queueID });

  if (!queue) {
    res.status(404).send({
      message: "Invalid Queue ID!"
    });
  }

  var tracks = queue.tracks;

  tracks.sort(function(a, b) {
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

router.post("/voteTrack", jwtTokenCheck.hostAndClientAccess, async (req, res) => {
  var queueID = parseInt(req.query.queueID);
  var trackID = req.query.trackID;

  var queue = await Queue.findOne({ queueID: queueID });

  if (!queue) {
    return res.status(404).send({
      message: "Invalid Queue ID!"
    });
  }

  var trackExists = false;

  queue.tracks.some(item => {
    if (item.id === trackID) {
      trackExists = true;
      return true;
    }
  });

  if (!trackExists) {
    return res.status(404).send();
  }

  await Queue.findOneAndUpdate(
    {
      queueID: queueID,
      "tracks.id": trackID
    },
    {
      $inc: {
        "tracks.$.votes": 1
      }
    }
  );

  return res.send();
});

router.post("/unvoteTrack", jwtTokenCheck.hostAndClientAccess, async (req, res) => {
  var queueID = parseInt(req.query.queueID);
  var trackID = req.query.trackID;

  var queue = await Queue.findOne({ queueID: queueID });

  if (!queue) {
    return res.status(404).send({
      message: "Invalid Queue ID!"
    });
  }

  var track;

  queue.tracks.some(item => {
    if (item.id === trackID) {
      track = item;
      return item;
    }
  });

  if (!track) {
    return res.status(404).send();
  }
  if (track.votes === 1) {
    queue.tracks = queue.tracks.filter(item => {
      return item.id !== track.id;
    });

    await queue.save();
    return res.send("Item removed");
  }

  await Queue.findOneAndUpdate(
    {
      queueID: queueID,
      "tracks.id": trackID
    },
    {
      $inc: {
        "tracks.$.votes": -1
      }
    }
  );

  return res.send("Item decremented");
});

//ToDo check if track is in tracks list if so remove
router.post("/currentTrack", jwtTokenCheck.hostAccess, async (req, res) => {
  let reqTrack = req.body.track;
  let queueID = parseInt(req.headers["x-queue-id"]);

  var track = new Track({
    id: reqTrack.id,
    title: reqTrack.title,
    artist: reqTrack.artist,
    duration: reqTrack.duration,
    coverURL: reqTrack.coverURL
  });

  var queue = await Queue.findOne({ queueID: queueID });

  queue.currentTrack = track;

  await queue.save();

  res.send();
});

router.get("/nextTrack", jwtTokenCheck.hostAccess, async (req, res) => {
  var queueID = parseInt(req.query.queueID);

  var queue = await Queue.findOne({ queueID: queueID });

  if (!queue) {
    res.status(404).send({
      message: "Invalid Queue ID!"
    });
  }

  var tracks = queue.tracks;

  if (tracks.length == 0) {
    res.status(200).send();
    return;
  }

  tracks.sort(function(a, b) {
    if (a.votes < b.votes) return 1;
    if (a.votes > b.votes) return -1;
    return 0;
  });

  var nextTrack = tracks[0];

  queue.tracks.splice(
    queue.tracks.findIndex(item => item.id === nextTrack.id),
    1
  );

  await queue.save();

  delete nextTrack.votes;

  res.send({
    track: nextTrack
  });

  //await queueDB.removeTrack(queueID, nextTrack.id);
});

router.get("/currentTrack", jwtTokenCheck.hostAndClientAccess, async (req, res) => {
  let queueID = parseInt(req.headers["x-queue-id"]);

  var queue = await Queue.findOne({ queueID: queueID });

  if (!queue) {
    res.status(404).send({ error: "No queue found" });
  }

  var currentTrack = queue.currentTrack;

  res.send({ track: currentTrack });
});

router.delete("/removeTrack", jwtTokenCheck.hostAccess, async(req, res) => {
  let queueID = parseInt(req.query.queueID);
  let trackID = req.query.trackID;

  if(!queueID) {
    return res.status(404).send({error: "No Queue Id provided"});
  }

  if(!trackID)  {
    return res.status(404).send({error: "No Track Id provided"});

  }

  var queue = await Queue.findOne({ queueID: queueID });

  if (!queue) {
    res.status(404).send({ error: "No queue found" });
  }

  await Queue.findOneAndUpdate(
      {
        queueID: queueID,
      },
      {
        $pull: {
          tracks : {
            id: trackID
          }
        }
      }
  );

  return res.status(200).send();
});

module.exports = router;
