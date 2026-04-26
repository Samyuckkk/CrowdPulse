const eventModel = require('../models/event.model')
const storageService = require('../services/storage.services')
const { v4: uuid } = require('uuid')

async function createEvent(req, res){
    console.log("Controller hit")
    const {name, location, startDate, endDate} = req.body

    if(!req.file){
        return res.status(400).json({
            message: "File is required!"
        })
    }

    const mapUploadResult = await storageService.uploadFile(req.file.buffer, uuid())

    if(!mapUploadResult?.url){
        return res.status(500).json({
            message: "Upload failed!"
        })
    }

    const newEvent = await eventModel.create({
        name,
        location,
        startDate,
        endDate,
        mapURL: mapUploadResult.url,
        createdBy: req.admin._id
    })

    res.status(201).json({
        message: "File uploaded successfully",
        event: newEvent
    })
}

module.exports = {
    createEvent
}