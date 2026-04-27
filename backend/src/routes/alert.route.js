const express = require('express')
const alertController = require("../controller/alert.controller")
const authMiddleware = require("../middlewares/auth.middleware")
const multer = require('multer')

const router = express.Router()

const upload = multer({
    storage: multer.memoryStorage(),
})

router.post('/generate', authMiddleware.authAdminMiddleware, upload.single("video"), alertController.generateAlert)
router.post('/volunteer/sos/:zoneId', authMiddleware.authVolunteerMiddleware, alertController.createVolunteerSosAlert)
router.patch('/:alertId/assign', authMiddleware.authAdminMiddleware, alertController.assignAlert)
router.patch('/:alertId/resolve', alertController.resolveAlert)
router.get('/:eventId/active', authMiddleware.authAdminMiddleware, alertController.getActiveAlerts)
router.get('/:eventId/logs', authMiddleware.authAdminMiddleware, alertController.getLogs)

module.exports = router
