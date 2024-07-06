import bcrypt from "bcrypt"
import User from '../models/User.js';

const UserController = {

    async register(req, res) {
        const { name, email, password, isAdmin } = req.body;

        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(422).json({ msg: "Email already exists" });
        }

        const salt = await bcrypt.genSalt(12);
        const passwordHash = await bcrypt.hash(password, salt);

        const newUser = new User({
            name,
            email,
            password: passwordHash,
            isAdmin
        });

        try {
            await newUser.save();
            res.status(201).json({
                msg: "User created successfully!"
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({
                msg: "A server error occurred, please try again later"
            });
        }
    },
};

export default UserController;