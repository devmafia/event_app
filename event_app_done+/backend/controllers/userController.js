const { Users_events }  = require("../models/models.js");

const getUserdata = async (req, res, next) => {
    try {
        const id = req.userId;
        console.log(id);
        const user = await Users_events.findByPk(id);
        console.log(user);
        if (user) {
            res.status(200).json(user);
        } else {
            res.status(404).json({ message: "User not found" });
        }
    } catch (error) {
        next(error);
    }
};

const createUser = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;
        const newUser = await Users_events.create({ username, email, password });
        res.status(201).json(newUser);
    } catch (error) {
        next(error);
    }
};

const updateName = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id, 10);
        const { username } = req.body;
        const [updated] = await Users_events.update({ username }, { where: { id } });
        if (updated) {
            const updatedUser = await Users_events.findByPk(id);
            res.status(200).json(updatedUser);
        } else {
            res.status(404).json({ message: "User not found" });
        }
    } catch (error) {
        next(error);
    }
};

const updateEmail = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id, 10);
        const { email } = req.body;
        const [updated] = await Users_events.update({ email }, { where: { id } });
        if (updated) {
            const updatedUser = await Users_events.findByPk(id);
            res.status(200).json(updatedUser);
        } else {
            res.status(404).json({ message: "User not found" });
        }
    } catch (error) {
        next(error);
    }
};

const updatePassword = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id, 10);
        const { password } = req.body;
        const [updated] = await Users_events.update({ password }, { where: { id } });
        if (updated) {
            const updatedUser = await Users_events.findByPk(id);
            res.status(200).json(updatedUser);
        } else {
            res.status(404).json({ message: "User not found" });
        }
    } catch (error) {
        next(error);
    }
};

const deleteUser = async (req, res) => {
    try {
        const userId = req.userId;

        await Bookings.destroy({ where: { userId } });
        
        const deletedUser = await Users_events.destroy({ where: { id: userId } });

        if (!deletedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting user' });
    }
};

module.exports = { createUser, updateName, updateEmail, updatePassword, getUserdata, deleteUser}