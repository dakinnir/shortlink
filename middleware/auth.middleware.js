const jwt = require('jsonwebtoken')

const config = require('../utils/config')

// Authentication middleware
const authenticateUser = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];

        // Verify the token
        const decodedToken = jwt.verify(token, config.ACCESS_TOKEN_SECRET);
        console.log(decodedToken)

        // Attach the user ID to the request object
        req.userId = decodedToken.userId;

        next();
    } catch (error) {
        console.error('Error authenticating user:', error);
        res.status(401).json({ error: 'Unauthorized' });
    }
};

module.exports = {
    authenticateUser
}