import express from 'express'
import bcrypt from "bcrypt"
import jwt from 'jsonwebtoken'
import User from '../models/User.js'

import genericController from '../controllers/crudController.js';

const router = express.Router();

const userController = genericController(User);

// Public Route
router.get('/', (req, res) => {
    res.status(200).json({
        msg: 'Welcome to our API'
    })
});

// Private Route
router.get('/user/:id', checkToken, async (req, res) => {

    const id = req.params.id

    //check if user exists
    const user = await User.findById(id, '-password')

    if(!user) {
        return res.status(404).json({
            msg: "User not found"
        })
    }

    res.status(200).json({
        user
    })
});

function checkToken(req, res, next) {

    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(" ")[1]

    if(!token) {
        return res.status(401).json({
            msg: "Access denied"
        })
    }

    try {
        const secret = process.env.SECRET

        jwt.verify(token, secret)

        next()
    } catch(error) {
        res.status(400).json({
            msg: "Invalid token"
        })
    }

}

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

//Login user
router.post('/auth/login', async(req, res) => {
    const { email, password } = req.body

    //validations
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

    //check if user exist
    const user = await User.findOne({ email: email})

    if(!user) {
        return res.status(404).json({
            msg: "User not found"
        })
    }

    //check if password match
    const checkPassword = await bcrypt.compare(password, user.password)

    if(!checkPassword) {
        return res.status(422).json({
            msg: 'Invalid password'
        })
    }

    try{
        const secret = process.env.SECRET
        const token = jwt.sign(
            {
                id: user._id,
            },
            secret,
        )

        res.status(200).json({
            msg: "Authentication completed successfully", token
        })
    }catch(err){
        console.log(err)
        return res.status(500).json({
            msg: "A server error occurred, please try again later"
        })
    }
})

export default router;