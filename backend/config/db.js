const mongoose = require("mongoose");

const dbConnect = () => {
    try {
        const uri = process.env.MONGO_URL;
        const conn = mongoose.connect(uri);
        console.log("db connected successfully");
    }
    catch (error) {
        console.error('Error connecting to MongoDB:', error);
    }
}

module.exports = dbConnect;