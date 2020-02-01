const { DBConnection } = require("./dbConnection.js");

var queueDB = {
  createQueue: async function(queue) {
    var db = await loadQueuesCollection();
    db.insertOne(queue);
  },

  closeQueue: async function(queueID) {
    var db = await loadQueuesCollection();
    db.deleteOne({ queueID: queueID });
  },

  queueExists: async function(queueID) {
    var db = await loadQueuesCollection();
    return await db.findOne({ queueID: queueID });
  },

  addTrack: async function(queueID, track) {
    var db = await loadQueuesCollection();

    return await db.updateOne(
      {
        queueID: queueID
      },
      {
        $push: { tracks: track }
      }
    );
  },

  voteTrack: async function(queueID, trackID) {
    var db = await loadQueuesCollection();

    return await db.updateOne(
      {
        queueID: queueID,
        "tracks.id": trackID
      },
      {
        $inc: { "tracks.$.votes": 1 }
      },
      false,
      true
    );
  },

  unvoteTrack: async function(queueID, trackID) {
    var db = await loadQueuesCollection();

    return await db.updateOne(
      {
        queueID: queueID,
        "tracks.id": trackID
      },
      {
        $inc: { "tracks.$.votes": -1 }
      },
      false,
      true
    );
  },

  removeTrackIfNoVotes: async function(queueID, trackID) {
    var db = await loadQueuesCollection();
    return db.updateOne(
      {
        queueID: queueID
      },
      {
        $pull: { tracks: { id: { $in: [trackID] }, votes: 0 } }
      }
    );
  },

  removeTrack: async function(queueID, trackID) {
    var db = await loadQueuesCollection();
    return db.updateOne(
      {
        queueID: queueID
      },
      {
        $pull: { tracks: { id: { $in: [trackID] } } }
      }
    );
  },

  setCurrentTrack: async function(queueID, track) {
    var db = await loadQueuesCollection();

    return await db.updateOne(
      {
        queueID: queueID
      },
      {
        $set: { currentTrack: track }
      }
    );
  },
};

async function loadQueuesCollection() {
  const client = await DBConnection.connect();
  return client.db("queue").collection("queues");
}

module.exports = queueDB;
