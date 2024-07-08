import bcrypt from "bcrypt"
import User from '../models/User.js'

const UserController = {

    async register(req, res) {
        const { name, email, password, isAdmin } = req.body

        const userExists = await User.findOne({ email })

        if (userExists) {
            return res.status(422).json({ msg: "Email already exists" })
        }

        const salt = await bcrypt.genSalt(12);
        const passwordHash = await bcrypt.hash(password, salt)

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
            res.status(500).json({
                msg: "A server error occurred, please try again later"
            });
        }
    },

    async createAdmin(req, res) {
        const { email } = req.body;

        try {
            const user = await User.findOneAndUpdate({ email }, { isAdmin: true }, { new: true })

            if (!user) {
                return res.status(404).json({ msg: "User not found" })
            }

            res.status(200).json({
                msg: "User updated to admin successfully!",
            });
        } catch (error) {
            res.status(500).json({
                msg: "A server error occurred, please try again later"
            });
        }
    },


    async deleteUser(req, res) {
        
        const { id } = req.params

        try {
            const user = await User.findById(id)

            if (!user) {
                return res.status(404).json({ msg: "User not found" })
            }

            if (user.isAdmin) {
                return res.status(403).json({ msg: "Deleting administrators is not allowed" })
            }

            await user.deleteOne({ _id: user.id })
            res.json({ msg: "User removed successfully" })
        } catch (err) {
            res.status(500).json({ msg: 'Server error.' })
        }
    },

    async updateUser(req, res) {
        const { id } = req.params;
        const { name, email, password, isAdmin } = req.body

        try {
            const user = await User.findById(id)

            if (!user) {
                return res.status(404).json({ msg: "User not found" })
            }

            if (!req.user.isAdmin && req.user._id.toString() !== id) {
                return res.status(403).json({ 
                    msg: "Unauthorized to update this user" 
                });
            }

            user.name = name || user.name
            user.email = email || user.email

            if (password) {
                const salt = await bcrypt.genSalt(12)
                user.password = await bcrypt.hash(password, salt)
            }

            user.isAdmin = isAdmin === undefined ? user.isAdmin : isAdmin

            const updatedUser = await user.save();
            res.json(updatedUser)
        } catch (err) {
            res.status(500).json({ 
                msg: 'Server error.' 
            });
        }
    },

    async listCustomers(req, res) {
        try {
            const { page = 1, limit = 5 } = req.query
            const nonAdminUsers = await User.find({ isAdmin: false })
                .skip((page - 1) * limit)
                .limit(parseInt(limit))
            res.json(nonAdminUsers)
        } catch (err) {
            res.status(500).json({ msg: 'Server error.' })
        }
    },

    async getClienteById (req, res) {
        try {
            const user = await User.findById(req.params.id)
            if (!user) return res.status(404).json({ error: 'User not found' })
            res.json(user)
        } catch (err) {
            res.status(500).json({ msg: 'Server error.' })
        }
    }
};

export default UserController