import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/user.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "10d" });
};

router.post("/register", async (req, res, next) => {
    const { username, email, password } = req.body;
    console.log("Register in progress", { username, email, password: password ? "provided" : "missing" });
     
    try {
        if (!username || !email || !password) {
            console.log("missing fields");
            return res.status(400).json({ message: "please provide all fields" });
        }
        console.log("checking if user exists");
        const userExists = await User.findOne({ $or: [{ username }, { email }] });
        if (userExists) {
            return res.status(400).json({ message: "User already exists" });
        }
        console.log("creating user");
        const user = await User.create({
            username,
            email,
            password
        });
        if (user) {
            return res.status(201).json({
                _id: user._id,
                username: user.username,
                email: user.email,
                token: generateToken(user._id),
                message: "User created successfully"
            });
        } else {
            return res.status(400).json({ message: "invalid user data" });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Internal server error" });
    }
});

router.post("/login", async (req, res, next) => {
    const { emailOrUsername, password } = req.body;
    try {
        if (!emailOrUsername || !password) {
            return res.status(400).json({ message: "please provide all fields" });
        }
        const user = await User.findOne({
            $or: [
                { email: emailOrUsername.toLowerCase() },
                { username: emailOrUsername }
            ],
        });
        if (user && (await user.matchPassword(password))) {
            res.json({
                _id: user._id,
                username: user.username,
                email: user.email,
                token: generateToken(user._id),
            });
        } else {
            res.status(401).json({ message: "invalid credentials" });
        }
    } catch (error) {
        next(error);
    }
});

router.get("/me", protect, async (req, res, next) => {
    try {
        res.json(req.user);
    } catch (error) {
        next(error);
    }
});

export default router;