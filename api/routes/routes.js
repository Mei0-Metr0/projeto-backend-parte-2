import express from 'express'
import bcrypt from "bcrypt"
import jwt from 'jsonwebtoken'
import User from '../models/User.js'

const router = express.Router();

// Public Route
router.get('/', (req, res) => {
    res.status(200).json({
        msg: 'Welcome to our API'
    })
});

//Register User
router.post('/auth/register', async(req, res) => {
    const {name, email, password, confirmpassword} = req.body

    if(!name) {
        return res.status(422).json({
            msg: "Name is required"
        })
    }

    if(!email) {
        return res.status(422).json({
            msg: "Email is required"
        })
    }

    if(!password) {
        return res.status(422).json({
            msg: "Password is required"
        })
    }

    if(password != confirmpassword) {
        return res.status(422).json({
            msg: "Passwords don't match"
        })
    }

    //check if user exists
    const userExists = await User.findOne({ email: email})

    if(userExists) {
        return res.status(422).json({
            msg: "Email already exists"
        })
    }

    //create password
    const salt = await bcrypt.genSalt(12)
    const passwordHash = await bcrypt.hash(password, salt)

    // create user
    const user = new User({
        name,
        email,
        password: passwordHash,
    })

    try {
        await user.save()
        res.status(201).json({
            msg: "User created successfully!"
        })
    } catch(error) {
        console.log(error)

        res.status(500).json({ 
            msg: "A server error occurred, please try again later"
        })
    }
})

export default router;