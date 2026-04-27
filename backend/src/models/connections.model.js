// models/connection.model.js
const mongoose = require('mongoose');

const connectionSchema = new mongoose.Schema({
    eventId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "event",
        required: true
    },
    from: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "zone",
        required: true
    },
    to: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "zone",
        required: true
    },
    distance: {
        type: Number,
        default: 1
    }
}, { timestamps: true });

const connectionModel = mongoose.model('connection', connectionSchema);

module.exports = connectionModel;