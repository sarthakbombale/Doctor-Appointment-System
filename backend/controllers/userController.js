const User = require('../models/userModel.js')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const register = async (req, res) => {
    console.log(req.body)

    // ❌ password was const earlier and reassigned → FIX: use let
    const { name, email, contactNumber, address } = req.body;
    let { password } = req.body;

    try {
        const exisitingUser = await User.findOne({
            where: { email: email }
        })

        // ❌ user-exists logic was unreachable
        if (exisitingUser) {
            return res.status(400).send({ msg: "User already exists", success: false });
        }

        const salt = await bcrypt.genSalt(10);
        password = await bcrypt.hash(password, salt); // ✅ now allowed

        const regUser = await User.create({
            name,
            email,
            password,
            contactNumber,
            address
        });

        if (!regUser) {
            return res.status(400).send({ msg: "Not registered", success: false });
        }

        // ❌ success was false earlier
        res.status(201).json({ msg: "Register successfully", success: true });

    } catch (error) {
        res.status(500).send({ msg: "Server Error", error: error.message });
    }
};

const login = async (req, res) => {
    console.log(req.body)

    // ❌ re.body typo already fixed
    const { email, password } = req.body;

    try {
        const loggedUser = await User.findOne({
            where: { email: email }
        })

        if (!loggedUser) {
            return res.status(400).send({ msg: "User not found", success: false });
        }

        if (await bcrypt.compare(password, loggedUser.password)) {
            const payload = { id: loggedUser.id, role: loggedUser.role };

            // ❌ SECRET_KEY typo fixed earlier
            const token = jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: '1d' });

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
        // ❌ empty handler earlier → must send response
        res.status(200).json({ msg: "User info route working" });
    } catch (error) {
        res.status(500).send({ msg: "Server Error", error: error.message });
    }
};

// ❌ getUserInfo was NOT exported earlier → caused crash
module.exports = { register, login, getUserInfo };
