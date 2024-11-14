const { Users_events, Admin, Administrator } = require("../models/models");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { jwtSecret, jwtExpiry, jwtAdminSecret, jwtAdminExpiry } = require('../config/jwt');

const register = async (req, res, next) => {
    const { username, email, password } = req.body;

    try {
        const existingUser = await Users_events.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await Users_events.create({
            username,
            email,
            password: hashedPassword,
        });

        res.status(201).json({ message: 'User registered successfully'});
    } catch (error) {
        next(error);
    }
};

const login = async (req, res, next) => {
    const { email, password } = req.body;

    try {
        const user = await Users_events.findOne({ where: { email } });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user.id, email: user.email }, jwtSecret, {
            expiresIn: jwtExpiry,
        });

        res.status(200).json({ message: 'Login successful', token: token, userId: user.id });
    } catch (error) {
        next(error);
    }
};

const loginAdmin = async (req, res, next) => {
    const { email, password } = req.body;

    try {
        const user = await Administrator.findOne({ where: { email } });
        // console.log(user);
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        // const isMatch = await bcrypt.compare(password, user.password);

        if (password !== user.password) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
       
        const token = jwt.sign({ id: user.id, email: user.email }, jwtAdminSecret, {
            expiresIn: jwtAdminExpiry,
        });

        res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
        next(error);
    }
};

const logout = (req, res) => {
    res.status(200).json({ message: 'Logged out successfully' });
};

module.exports = { login, register, logout, loginAdmin };
