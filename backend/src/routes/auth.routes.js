const express = require('express')
const authController = require('../controller/auth.controller')

const router = express.Router()

// admin routes
router.post('/admin/register', authController.registerAdmin)
router.post('/admin/login', authController.loginAdmin)
router.post('/admin/logout', authController.logoutAdmin)

// volunteer routes
router.post('/volunteer/register', authController.registerVolunteer)
router.post('/volunteer/login', authController.loginVolunteer)
router.post('/volunteer/logout', authController.logoutVolunteer)


module.exports = router