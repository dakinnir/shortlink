const express = require('express');
const router = express.Router();

const { loginUser, registerUser } = require('../../controllers/auth.controller')

// @route   POST /api/v1/auth/register
// @desc    Register a new user
router.post('/register', registerUser);

// @route   POST /api/v1/auth/login
// @desc    Authenticate user & get token
router.post('/login', loginUser);

// Logout Route
router.post('/logout', (req, res) => {
    res.clearCookie('authToken'); // Clear the HTTP-only cookie
    res.status(200).json({ message: 'Logged out successfully' });
});

module.exports = router
