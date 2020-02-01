const router = require("express").Router();

const Queue = require('../../model/Queue');
const Track = require('../../model/Track');
const util = require('../../util/index');
const jwtTokenGen = require("../../util/token/tokenHandler");
const jwtTokenCheck = require("../../util/token/tokenChecker");


router.post('/createQueue', async (req, res) => {
    var foundUniqueKey = false;
    while (!foundUniqueKey) {
      var queueID = util.generateNewQueueID();
      foundUniqueKey = ! await Queue.findOne({queueId: queueID});
    }
  
    let queueTokenSalt = util.generateRandomString(16);

    const queue = new Queue({
        queueId: queueID,
        tokenSalt: queueTokenSalt
    });

    try {
        const savedQueue = await queue.save();

        let refreshToken = jwtTokenGen.createRefreshTokenHost(savedQueue.tokenSalt);
        res.cookie("refreshToken", refreshToken, {httpOnly: true, Secure: true});

        res.status(201).send( {
            queueId: savedQueue.queueId,
            tracks: savedQueue.tracks,
            token: jwtTokenGen.signHostData(savedQueue.tokenSalt, {queueId: savedQueue.queueId})
        } );
    } catch(err) {
        console.log(err);
        res.status(400).send(err);
    }
});

//ToDo check if actual object id is used or queueId
router.delete("/closeQueue", jwtTokenCheck.hostAccess, async (req, res) => {
  var id = parseInt(req.query.id);
  Queue.deleteOne({ queueId: id}, function(err) {
      res.status(204).send(err)
  });

  res.status(200).send();
});

//ToDo check if needed
router.get("/queueAll", async (req, res) => {
    await Queue.find({}, (err, queues) => {
      res.send(queues);
    }, {});
});

router.post("/addTrack", jwtTokenCheck.hostAndClientAccess, async (req, res) => {
    var queueID = parseInt(req.body.queueID);
    var queue = await Queue.findOne({queueId: queueID});
  
    if (!queue) {
      return res.status(404).send({
        message: "Invalid Queue ID!"
      });
    }
  
    var track = Track({
        id: req.body.track.id,
        title: req.body.track.title,
        artist: req.body.track.artist
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
                queueId: queueID,
                "tracks.id": track.id 
            },{
                $inc: {
                    "tracks.$.votes": 1
                }
            });

        return res.send("Voted up");
    }
  
    // TODO: Verify Track has needed Information
    queue.tracks.push(track);
    let newQueue = await queue.save();
    res.send(newQueue);
  });

router.get("/getTracks", jwtTokenCheck.hostAndClientAccess, async (req, res) => {
  var queueID = parseInt(req.query.queueID);

  var queue = await Queue.findOne({queueId : queueID});

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
  
router.post("/voteTrack", jwtTokenCheck.hostAndClientAccess, async (req, res) => {
    var queueID = parseInt(req.query.queueID);
    var trackID = req.query.trackID;

    var queue = await Queue.findOne({queueId: queueID});
  
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
            queueId: queueID,
            "tracks.id": trackID 
        },{
            $inc: {
                "tracks.$.votes": 1
            }
        });

    return res.send();
});

router.post("/unvoteTrack", jwtTokenCheck.hostAndClientAccess, async (req, res) => {
    var queueID = parseInt(req.query.queueID);
    var trackID = req.query.trackID;

    var queue = await Queue.findOne({queueId: queueID});
  
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
    if(track.votes === 1) {
        queue.tracks = queue.tracks.filter( (item) => {
            return item.id !== track.id;
        })

        await queue.save();
        return res.send("Item removed");
    }

    await Queue.findOneAndUpdate( 
        {
            queueId: queueID,
            "tracks.id": trackID 
        },{
            $inc: {
                "tracks.$.votes": -1
            }
        });

    return res.send("Item decremented");
})
module.exports = router;
