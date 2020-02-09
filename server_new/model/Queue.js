const Track = require('./Track');
const mongoose = require('mongoose');
const crypto = require('crypto')


const queueSchema = new mongoose.Schema({
    queueID: {
        type: Number,
        required: true,
        unique: true,
        min : 100000,
        max : 999999
    },
    tokenSalt: {
        type: String,
        required: true,
        min: 16,
        max: 16
    },
    tracks: {
        type: [Track.schema]
    },
    currentTrack: {
        type: Track.schema
    },
    accessToken: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true
    }
});

queueSchema.methods.checkPassword = function(password) {
    let hash = crypto.createHash('md5').update( queue.tokenSalt + queue.tokenSalt + password + queue.tokenSalt).digest("hex");

    console.log(this.password === hash);
    return this.password === hash;
};

queueSchema.methods.hasPassword = function(queueID) {
    return this.tokenSalt !== this.password;
};

module.exports = mongoose.model('Queue', queueSchema);