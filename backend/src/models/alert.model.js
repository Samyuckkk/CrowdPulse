const mongoose = require('mongoose')

const alertSchema = new mongoose.Schema({
    eventId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "event",
        required: true
    },
    zoneId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "zone",
        required: true
    },
    assignedVolunteerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "volunteer",
        default: null
    },
    action: {
        type: String,
        required: true
    },
    severity: {
        type: String,
        enum: ["SAFE", "MEDIUM", "HIGH"],
        default: "SAFE"
    },
    isResolved: {
        type: Boolean,
        default: false
    },
    resolvedAt: {
        type: Date,
        default: null
    }
}, {
    timestamps: true
})

const alertModel = mongoose.model('alert', alertSchema)

module.exports = alertModel