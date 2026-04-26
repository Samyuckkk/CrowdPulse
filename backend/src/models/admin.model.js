const mongoose = require('mongoose')

const adminSchema = new mongoose.Schema({
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
    }
},
{
    timestamps: true
})

const adminModel = mongoose.model('admin', adminSchema)

module.exports = adminModel