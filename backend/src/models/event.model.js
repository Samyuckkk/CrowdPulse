const mongoose = require('mongoose')

const eventSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    mapURL: {
        type: String,
        required: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "admin",
        required: true
    }
},{
    timestamps: true
})

const eventModel = mongoose.model('event', eventSchema)

module.exports = eventModel