import jwt from 'jsonwebtoken'
import User from '../models/User.js'

async function checkToken(req, res, next) {

    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(" ")[1]

    if (!token) {
        return res.status(401).json({ msg: "Access denied, token missing" })
    }

    try {
        const secret = process.env.SECRET
        const decoded = jwt.verify(token, secret)
        const user = await User.findById(decoded.id)

        if (!user) {
            return res.status(404).json({ msg: "User not found" })
        }

        req.user = user
        next()
    } catch (error) {
        res.status(401).json({ msg: "Invalid token" })
    }
}

async function checkAdmin(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(" ")[1]
    if (!token) {
        return res.status(401).json({ msg: "Access denied" })
    }

    try {
        const secret = process.env.SECRET
        const decoded = jwt.verify(token, secret)
        const user = await User.findById(decoded.id)

        if (!user || !user.isAdmin) {
            return res.status(403).json({ msg: "Access denied, not an admin" })
        }

        req.user = user
        next()
    } catch (error) {
        res.status(400).json({ msg: "Invalid token user", error })
    }
}

export { checkToken, checkAdmin }