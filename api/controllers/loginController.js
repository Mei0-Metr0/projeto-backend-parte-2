import bcrypt from "bcrypt"
import jwt from 'jsonwebtoken'

import User from '../models/User.js';

const login = async (req, res) => {

    const { email, password } = req.body

    const user = await User.findOne({ email})

    if(!user) {
        return res.status(404).json({
            msg: "User not found"
        })
    }

    const checkPassword = await bcrypt.compare(password, user.password)

    if(!checkPassword) {
        return res.status(422).json({
            msg: 'Invalid password'
        })
    }

    try {

        const jwtSecret = process.env.SECRET
        const jwtExpire = process.env.JWTEXPIRE

        const token = jwt.sign(
            {
                id: user._id,
            },
            jwtSecret, { expiresIn: jwtExpire }
        )

        res.status(200).json({
            msg: "Authentication completed successfully", token
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            msg: "A server error occurred, please try again later"
        })
    }
}

export default login;