const jwt = require('jsonwebtoken')
require('dotenv').config()

function auth(req, res, next) {
    if (!req.headers.authorization) {
        return res.status(400).send({ msg: "token not found" })
    }

    const tokenHeader = req.headers.authorization
    console.log(tokenHeader, "_________Token_______")

    if (!tokenHeader.startsWith('Bearer ')) {
        return res.status(400).send({ msg: "auth header bearer missing", success: false })
    }

    const token = tokenHeader.split(' ')[1]
    console.log(token, "after removing bearer")

    try {
        const secret = process.env.SECRET_KEY
        console.log("=== JWT VERIFY DEBUG ===")
        console.log("SECRET_KEY value:", JSON.stringify(secret))
        console.log("SECRET_KEY length:", secret ? secret.length : "undefined")
        console.log("Token (first 30 chars):", token.substring(0, 30) + "...")
        const decoded = jwt.verify(token, secret)
        console.log("✅ Token verified successfully")
        console.log("Decoded payload:", decoded)
        req.user = decoded
        next()
    } catch (err) {
        console.error("❌ JWT Verification FAILED")
        console.error("Error message:", err.message)
        console.error("Error name:", err.name)
        console.log("SECRET_KEY value:", JSON.stringify(process.env.SECRET_KEY))
        console.log("SECRET_KEY length:", process.env.SECRET_KEY ? process.env.SECRET_KEY.length : "undefined")
        return res.status(401).send({ msg: "Invalid or expired token" })
    }
}

function doctor(req, res, next) {
    if (req.user && req.user.role === 'Doctor') { // ✅ comparison + correct case
        return next()
    }
    return res.status(403).send({ msg: "you are not authorized" })
}

function admin(req, res, next) {
    if (req.user && req.user.role === 'Admin') { // ✅ comparison + correct case
        return next()
    }
    return res.status(403).send({ msg: "you are not authorized" })
}

module.exports = { auth, doctor, admin }
