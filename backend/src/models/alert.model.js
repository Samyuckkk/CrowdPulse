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
        enum: ["LOW", "MEDIUM", "HIGH"],
        default: null
    },
    isResolved: {
        type: Boolean,
        default: false
    },
    resolvedAt: {
        type: Date,
        dafult: null
    }
}, {
    timestamps: true
})

const alertModel = mongoose.model('alert', alertSchema)

module.exports = alertModel