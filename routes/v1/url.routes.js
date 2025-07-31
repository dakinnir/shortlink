const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../../models/user.model'); // Your User model

const { authenticateUser } = require('../../middleware/auth.middleware')


// @route   POST /api/v1/create-short-url
// @desc    Shorten long URL
router.post('/create-short-url', authenticateUser, async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.userId })

        res.status(200).json({ user });
    } catch (error) {
        res.status(500).json({ error: "Internal Server error" })
    }


});

router.post('/get-link', (req, res) => {
    res.status(200).json({ "message": 'Alright' });
});

module.exports = router;
