const mongoose = require('mongoose');

const trackSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    artist: {
        type: String,
        required: true,
    },
    duration: {
        type: Number,
        required: true,
    },
    coverURL: {
        type: String,
        required: true,
    },
    votes: {
        type: Number,
        required: true,
        default: 1
    }
});

module.exports = mongoose.model('Track', trackSchema);