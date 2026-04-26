const mongoose = require('mongoose')

function connectDB(){
    mongoose.connect(process.env.MongoDB_URI)
    .then(() => {
        console.log('DB Connected!')
    })
    .catch((err) => {
        console.log('DB Connecttion Error: ', err)
    })
}

module.exports = connectDB