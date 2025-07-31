const User = require('../models/user.model')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

// Config
const config = require('../utils/config')

// @route POST /api/v1/login
// @desc Authenticate user & get token
const loginUser = async (req, res) => {
    try {
        // Validate request
        const { email, password } = req.body;
        const user = await User.findOne({ email })
        if (!user || !(await user.matchPassword(password))) {
            res.status(401).json({ error: "Invalid credentials." })
        }
        // Generate JWTs
        const token = jwt.sign({ userId: user._id }, config.ACCESS_TOKEN_SECRET, {
            expiresIn: '1h',
        });

        if (config.NODE_ENV === "development") {
            return res.json({ message: 'Logged in successfully', token });
        }
        // Set the token as an HTTP-only cookie
        res.cookie('authToken', token, {
            httpOnly: true, // Makes the cookie inaccessible to client-side JS
            secure: config.NODE_ENV === 'production', // Use `secure: true` in production (requires HTTPS)
            sameSite: 'Lax', // Same site or allowed origins
            maxAge: 3600000,
        });

        res.status(200).json({ message: 'Login successful!', user: { id: user._id, email: user.email } });
    } catch (error) {
        console.error("Error logging in: ", error)
        res.status(500).json({ error: 'An error occurred while logging in.' })
    }
}

// @route POST /api/v1/register
// @desc Register user & get token
const registerUser = async (req, res) => {
    try {
        const { username, email, password } = req.body

        // Check if the email is already registered
        const existingUser = await User.findOne({ email })
        if (existingUser) {
            res.status(400).json({ error: 'Email is already in-use' });
        }
        // Create the new user
        const newUser = new User({ username, email, password })
        await newUser.save();
        res.status(201).json({ success: true.newUser, message: "User has been registered successfully" })
    } catch (error) {
        console.log("Error registering user: ", error)
        res.status(500).json({ error: "An error occurred while registering the user" })
    }

}

module.exports = {
    loginUser,
    registerUser
}