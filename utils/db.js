const mongoose = require('mongoose')
const config = require('./config')

const connectToDatabase = async () => {
    try {
        await mongoose.connect(config.MONGODB_URI);
        console.log("Connected to database successfully.", {
            uri: config.MONGODB_URI,
        })
    } catch (error) {
        console.log("Error connecting to the database.")
    }
}

const closeConnection = async () => {
    try {
        await mongoose.disconnect()
        console.log("Successfully disconnected the database.")
    } catch (error) {
        console.log("Error closing database connection.")
    }
}

module.exports = {
    connectToDatabase
}