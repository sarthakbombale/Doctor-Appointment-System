const User = require('../models/userModel.js')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

BASEURL = 'http://localhost:7005/uploads';

const register = async (req, res) => {
    console.log(req.body)

    const { name, email, contactNumber, address } = req.body;
    let { password } = req.body;
    imagePath = req.file ? req.file.filename : null

    try {
        const exisitingUser = await User.findOne({
            where: { email: email }
        })

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
            address,
            imagePath
        });

        if (!regUser) {
            return res.status(400).send({ msg: "Not registered", success: false });
        }

        res.status(201).json({ msg: "Register successfully", success: true });

    } catch (error) {
        res.status(500).send({ msg: "Server Error", error: error.message });
    }
};

const login = async (req, res) => {
    console.log(req.body)

    const { email, password } = req.body;

    // Validate required fields before database query
    if (!email || !password) {
        return res.status(400).send({ msg: "Email and password are required", success: false });
    }

    try {
        const loggedUser = await User.findOne({
            where: { email: email }
        })

        if (!loggedUser) {
            return res.status(400).send({ msg: "User not found", success: false });
        }

        if (await bcrypt.compare(password, loggedUser.password)) {
            const payload = { id: loggedUser.id, role: loggedUser.role };

            const secret = process.env.SECRET_KEY
            console.log("=== JWT SIGN DEBUG ===")
            console.log("SECRET_KEY value:", JSON.stringify(secret))
            console.log("SECRET_KEY length:", secret ? secret.length : "undefined")
            console.log("Payload:", payload)
            const token = jwt.sign(payload, secret, { expiresIn: '1d' });
            console.log("✅ Token created successfully")
            console.log("Token (first 30 chars):", token.substring(0, 30) + "...")

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
    console.log(req.user, "In controller")
    try {
        const loggedUser = await User.findByPk(
            req.user.id, {
            attributes: ["id", "name", "email", "address", "role", "imagePath"]
        }
        )
        if (loggedUser.imagePath) {
            loggedUser.imagePath = `${BASEURL}/${loggedUser.imagePath}`;
        }


        console.log("-------------------", loggedUser)
        res.status(200).json({ user: loggedUser, success: true });
    } catch (error) {
        res.status(500).send({ msg: "Server Error", error: error.message });
    }
};


const doctorList = async (req, res) => {
    console.log(req.user, "In controller")
    try {
        const doctors = await User.findAll({
            where: { role: 'doctor' },
            attributes: ["id", "name"]
        })
        res.status(200).json({ doctors: doctors, success: true });
    } catch (error) {
        res.status(500).send({ msg: "Server Error", error: error.message });
    }
};


module.exports = { register, login, getUserInfo, doctorList };
