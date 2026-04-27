const alertModel = require('../models/alert.model')
const zoneModel = require("../models/zone.model")
const volunteerModel = require('../models/volunteer.model')
const { getLLMAction } = require('../services/llm.service')

async function syncVolunteerZoneAssignment(volunteerId) {
    if(!volunteerId){
        return
    }

    const activeAssignment = await alertModel
        .findOne({
            assignedVolunteerId: volunteerId,
            isResolved: false
        })
        .sort({ createdAt: -1 })

    await volunteerModel.findByIdAndUpdate(volunteerId, {
        assignedTo: activeAssignment?.zoneId || null
    })
}

async function generateAlert(req, res){
    const {eventId, zoneId: zoneCode } = req.body

    if(!req.file){
        return res.status(400).json({
            message: "Video feed is required!"
        })
    }

    const zone = await zoneModel.findOne({
        code: zoneCode,
        eventId
    });

    if (!zone) {
        return res.status(404).json({
            message: "Zone not found"
        });
    }

    let riskLevel = "SAFE"
    const random = Math.random()

    if(random > 0.7) riskLevel = "HIGH"
    else if(random > 0.4) riskLevel = "MEDIUM"

    let suggestedAction = "Monitor situation"

    if(riskLevel === "HIGH" || riskLevel === "MEDIUM"){
        suggestedAction = await getLLMAction(zoneCode, riskLevel, eventId)
    }

    const newAlert = await alertModel.create({
        eventId,
        zoneId: zone._id,
        severity: riskLevel,
        action: suggestedAction
    })

    res.status(201).json({
        message: "Alert successfully created!",
        alert: newAlert
    })
}

async function assignAlert(req, res) {
    try {
        const { alertId } = req.params
        const { volunteerId } = req.body

        const alert = await alertModel.findById(alertId)

        if(!alert){
            return res.status(404).json({
                message: "Alert not found!"
            })
        }

        const volunteer = await volunteerModel.findById(volunteerId)

        if(!volunteer){
            return res.status(404).json({
                message: "Volunteer not found!"
            })
        }

        const previousVolunteerId = alert.assignedVolunteerId
        alert.assignedVolunteerId = volunteerId
        await alert.save()
        await syncVolunteerZoneAssignment(previousVolunteerId)
        await syncVolunteerZoneAssignment(volunteerId)

        await alert.populate('assignedVolunteerId', 'fullName email')
        await alert.populate('zoneId', 'name code')

        res.status(201).json({
            message: "Alert assigned succesfully",
            alert
        })

    } catch (err) {
        res.status(500).json({
            error: err.message
        })
    }
}

async function resolveAlert(req, res){
    try {
        const {alertId} = req.params
        
        const alert = await alertModel.findById(alertId)

        if(!alert){
            return res.status(404).json({
                message: "Alert not found!"
            })
        }

        if(alert.isResolved){
            return res.status(400).json({
                message: "Alert already resolved"
            })
        }

        const assignedVolunteerId = alert.assignedVolunteerId
        alert.isResolved = true
        alert.resolvedAt = new Date()

        await alert.save()
        await syncVolunteerZoneAssignment(assignedVolunteerId)

        res.status(201).json({
            message: "Alert resolved successfully",
            alert
        })

    } catch (err) {
        res.status(500).json({
            message: {
                error: err.message
            }
        })
    }
}

async function getActiveAlerts(req, res) {
    const { eventId } = req.params
    const alerts = await alertModel
        .find({ eventId, isResolved: false })
        .populate('zoneId', 'name code')
        .populate('assignedVolunteerId', 'fullName email')
    res.status(200).json({ message: "Active alerts fetched!", alerts })
}

async function getLogs(req, res) {
    const { eventId } = req.params
    const alerts = await alertModel
        .find({ eventId, isResolved: true })
        .populate('zoneId', 'name code')
        .populate('assignedVolunteerId', 'fullName email')
        .sort({ resolvedAt: -1 })
    res.status(200).json({ message: "Logs fetched!", alerts })
}

module.exports = {
    generateAlert,
    assignAlert,
    resolveAlert,
    getActiveAlerts,
    getLogs
}
