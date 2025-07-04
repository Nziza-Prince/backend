const mongoose = require('mongoose');
require("dotenv")

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('connected to database successfully!');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
};

module.exports = connectDB;