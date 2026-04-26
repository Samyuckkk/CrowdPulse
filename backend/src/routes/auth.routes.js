const express = require('express')
const authController = require('../controller/auth.controller')

const router = express.Router()

// admin routes
router.post('/admin/register', authController.registerAdmin)
router.post('/admin/login', authController.loginAdmin)
router.post('/admin/logout', authController.logoutAdmin)


module.exports = router