const Track = require('./Track');
const mongoose = require('mongoose');

const queueSchema = new mongoose.Schema({
    queueId: {
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
    }
});

module.exports = mongoose.model('Queue', queueSchema);