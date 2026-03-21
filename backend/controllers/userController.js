const User = require('../models/userModel.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const defaultAvatar = "https://cdn-icons-png.flaticon.com/512/149/149071.png";

const register = async (req, res) => {
    const { name, email, contactNumber, address, gender } = req.body;
    let { password } = req.body;

    // Cloudinary returns the full URL in req.file.path
    const imagePath = req.file ? req.file.path : defaultAvatar;

    try {
        const exisitingUser = await User.findOne({ where: { email: email } });
        if (exisitingUser) {
            return res.status(400).send({ msg: "User already exists", success: false });
        }

        const salt = await bcrypt.genSalt(10);
        password = await bcrypt.hash(password, salt);

        const regUser = await User.create({
            name,
            email,
            password,
            contactNumber,
            address,
            gender,
            imagePath
        });

        res.status(201).json({ msg: "Register successfully", success: true });
    } catch (error) {
        res.status(500).send({ msg: "Server Error", error: error.message });
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).send({ msg: "Email and password are required", success: false });
    }

    try {
        const loggedUser = await User.findOne({ where: { email: email } });
        if (!loggedUser) {
            return res.status(400).send({ msg: "User not found", success: false });
        }

        if (await bcrypt.compare(password, loggedUser.password)) {
            const payload = { id: loggedUser.id, role: loggedUser.role };
            const secret = process.env.SECRET_KEY;
            const token = jwt.sign(payload, secret, { expiresIn: '1d' });

            return res.status(200).send({
                msg: "Logged in successfully",
                success: true,
                token
            });
        }
        return res.status(400).send({ msg: "Password incorrect", success: false });
    } catch (error) {
        res.status(500).send({ msg: "Server Error", error: error.message });
    }
};

const getUserInfo = async (req, res) => {
    try {
        const loggedUser = await User.findByPk(req.user.id, {
            attributes: ["id", "name", "email", "address", "contactNumber", "gender", "role", "imagePath"]
        });

        if (!loggedUser) {
            return res.status(404).json({ msg: "User not found", success: false });
        }

        const userData = loggedUser.get({ plain: true });


        if (!userData.imagePath || String(userData.imagePath).includes("[object")) {
            userData.imagePath = defaultAvatar;
        }

        res.status(200).json({ user: userData, success: true });
    } catch (error) {
        console.error("getUserInfo Error:", error);
        res.status(500).send({ msg: "Server Error", error: error.message });
    }
};

const doctorList = async (req, res) => {
    try {
        const doctors = await Doctor.findAll({
            where: { status: "Accepted" },
            include: [{
                model: User,
                as: "user",
                attributes: ["id", "name", "gender"],
            }],
        });
        res.status(200).json({ success: true, doctors });
    } catch (error) {
        res.status(500).send({ msg: "Server Error", error: error.message });
    }
};

const userList = async (req, res) => {
    try {
        const users = await User.findAll({
            where: { role: 'User' },
            attributes: ["id", "name", "email", "contactNumber", "address", "gender", "imagePath"]
        });

        // ✅ Clean up image paths for the list by mapping to plain objects
        const updatedUsers = users.map(user => {
            const userData = user.get({ plain: true });

            if (!userData.imagePath || String(userData.imagePath).includes("[object")) {
                userData.imagePath = defaultAvatar;
            }
            return userData;
        });

        res.status(200).json({ users: updatedUsers, success: true });
    } catch (error) {
        console.error("userList Error:", error);
        res.status(500).send({ msg: "Server Error", error: error.message });
    }
};

const updateUser = async (req, res) => {
    try {
        const { name, email, contactNumber, address, gender } = req.body;
        const userId = req.user.id;

        const user = await User.findByPk(userId);
        if (!user) return res.status(400).send({ msg: "User not found", success: false });

        if (name !== undefined) user.name = name;
        if (email !== undefined) user.email = email;
        if (contactNumber !== undefined) user.contactNumber = contactNumber;
        if (address !== undefined) user.address = address;
        if (gender !== undefined) user.gender = gender;

        // ✅ Ensure we save the path string, not the object
        if (req.file) {
            user.imagePath = req.file.path;
        }

        await user.save();

        // ✅ Final cleanup for the response object
        const updatedUser = user.get({ plain: true }); // Cleaner than toJSON()
        if (!updatedUser.imagePath || updatedUser.imagePath === "[object Object]") {
            updatedUser.imagePath = "https://cdn-icons-png.flaticon.com/512/149/149071.png";
        }
        res.status(200).json({ msg: "User updated successfully", user: updatedUser, success: true });

    } catch (error) {
        console.error("updateUser ERROR:", error);
        // Explicitly send error.message so the frontend sees "config is not defined" 
        // instead of an empty alert or [object Object]
        res.status(500).json({ 
            success: false, 
            msg: error.message || "Server Error", 
            error: error.message 
        });
    }
};

module.exports = { register, login, getUserInfo, doctorList, userList, updateUser };