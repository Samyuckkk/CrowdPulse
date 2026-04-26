const express = require('express')
const eventController = require('../controller/event.controller')
const authMiddleware = require('../middlewares/auth.middleware')

const router = express.Router()

const multer = require('multer')
const upload = multer({
    storage: multer.memoryStorage(),
})

router.post('/create', authMiddleware.authAdminMiddleware, upload.single("map"), eventController.createEvent)

module.exports = router