const mongoose = require('mongoose')

const zoneSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    bbox: {
        x: { type: Number, required: true },
        y: { type: Number, required: true },
        w: { type: Number, required: true },
        h: { type: Number, required: true }
    },
    capacity: {
        type: Number,
        default: 0
    },
    currentCrowd: {
        type: Number,
        default: 0
    }
})

const zoneModel = mongoose.model('zone', zoneSchema)

module.exports = zoneModel