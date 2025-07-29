const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const helmet = require('helmet')

const app = express()

// Custom configuration/modules/routes
const config = require('./utils/config')
const rateLimit = require("express-rate-limit");

const v1Routes = require('./routes/v1/index')

const { connectToDatabase } = require('./utils/connectToDatabase')

const limiter = rateLimit({
    windowMs: 60 * 1000, // 15 minutes
    limit: 10, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
    standardHeaders: 'draft-8', // draft-6: `RateLimit-*` headers; draft-7 & draft-8: combined `RateLimit` header
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
    ipv6Subnet: 56, // Set to 60 or 64 to be less aggressive, or 52 or 48 to be more aggressive
    // store: ... , // Redis, Memcached, etc. See below.
})


// Configuration for middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Configures the access-control-allow-origin
const corsOptions = {
    origin(origin, callback) {
        if (config.NODE_ENV === 'development' || !origin || config.ALLOWED_ORIGINS.includes(origin)) {
            callback(null, true);
        } else {
            // Handle error from non-allowed origins making requests
            callback(new Error(`Request from ${origin} not allowed`));
        }
    }
};

app.use(cors(corsOptions)); // allows only these specified origins
app.use(helmet());


// Apply the rate limiting middleware to all requests.
app.use(limiter)


app.get('/', (request, response) => {
    response.status(200).send({
        message: 'Welcome to ShortLink'
    })
})

app.use('/api/v1', v1Routes)

const server = app.listen(config.PORT, async () => {
    await connectToDatabase()
    console.log(`Server running: http://localhost:${config.PORT}`)
})


// Graceful shutdown logic for server
const shutdown = async () => {
    console.log('Shutdown initiated...');
    try {
        server.close(() => console.log('HTTP server closed.'));
        await mongoose.connection.close();
        console.log('MongoDB connection closed.');
        process.exit(0);
    } catch (err) {
        console.error('Error during shutdown:', err);
        process.exit(1);
    }
};

// Listen for termination signals
process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

