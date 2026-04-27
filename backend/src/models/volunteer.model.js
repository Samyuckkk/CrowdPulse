const mongoose = require('mongoose')

const volunteerSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "zone",
        default: null
    },
    eventId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "event",
        default: null
    }
},
{
    timestamps: true
})

const volunteerModel = mongoose.model('volunteer', volunteerSchema)

module.exports = volunteerModel