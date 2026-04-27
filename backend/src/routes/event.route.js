const express = require('express')
const eventController = require('../controller/event.controller')
const authMiddleware = require('../middlewares/auth.middleware')

const router = express.Router()

const multer = require('multer')
const upload = multer({
    storage: multer.memoryStorage(),
})

router.post('/create', authMiddleware.authAdminMiddleware, upload.single("map"), eventController.createEvent)
router.get('/', authMiddleware.authAdminMiddleware, eventController.getEvents)
router.get('/volunteer/zones', authMiddleware.authVolunteerMiddleware, eventController.getVolunteerZones)
router.get('/:eventId', authMiddleware.authAdminMiddleware, eventController.getEvent)
router.get('/:eventId/zones', authMiddleware.authAdminMiddleware, eventController.getZones)
router.get('/:eventId/volunteers', authMiddleware.authAdminMiddleware, eventController.getVolunteers)

module.exports = router
