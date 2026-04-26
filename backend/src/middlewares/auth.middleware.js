const adminModel = require('../models/admin.model')
const jwt = require('jsonwebtoken')

async function authAdminMiddleware(req, res, next){

    console.log("Middleware hit")

    const token = req.cookies.token

    if(!token){
        return res.status(401).json({
            message: "Please login first!"
        })
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        const admin = await adminModel.findById(decoded.id)
        req.admin = admin  // attach extra to request
        next()

    } catch (err) {
        return res.status(401).json({
            message: "Invalid token!"
        })
    }
}

module.exports = {
    authAdminMiddleware
}