import express from "express";
import User from "../models/user.js";
import bcrypt from "bcrypt";

const router = express.Router();

// GET all users
router.get("/", async (req, res) => {
    try {
        const users = await User.findAll({ attributes: { exclude: ["password"] } });
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST create new user
router.post("/", async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const hash = await bcrypt.hash(password, 10);
        const user = await User.create({ username, email, password: hash });
        res.json({ id: user.id, username: user.username, email: user.email });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
