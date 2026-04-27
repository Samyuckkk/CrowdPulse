const eventModel = require('../models/event.model')
const storageService = require('../services/storage.services')
const { v4: uuid } = require('uuid')

async function createEvent(req, res){
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

async function getEvents(req, res){
    const adminId = req.admin._id

    const events = await eventModel.find({
        createdBy: adminId
    })

    res.status(200).json({
        message: "Events fetched!",
        events
    })
}

async function getZones(req, res){
    const { eventId } = req.params
    const zoneModel = require('../models/zone.model')

    const event = await eventModel.findOne({ _id: eventId, createdBy: req.admin._id })
    if(!event){
        return res.status(404).json({ message: "Event not found!" })
    }

    const zones = await zoneModel.find({ eventId })
    res.status(200).json({ message: "Zones fetched!", zones })
}

async function getVolunteers(req, res){
    const { eventId } = req.params
    const volunteerModel = require('../models/volunteer.model')

    const event = await eventModel.findOne({ _id: eventId, createdBy: req.admin._id })
    if(!event) return res.status(404).json({ message: "Event not found!" })

    const volunteers = await volunteerModel.find({ eventId }).populate('assignedTo', 'name code')
    res.status(200).json({ message: "Volunteers fetched!", volunteers })
}

module.exports = {
    createEvent,
    getEvents,
    getZones,
    getVolunteers
}