const mongoose = require('mongoose');

let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        const opts = {
            bufferCommands: true, // Allow buffering to prevent errors
        };

        cached.promise = mongoose.connect(process.env.MONGO_URI, opts).then((mongoose) => {
            console.log('MongoDB connected');
            return mongoose;
        }).catch((error) => {
            console.error('MongoDB connection error:', error);
            throw error;
        });
    }

    try {
        cached.conn = await cached.promise;
    } catch (error) {
        console.error('Failed to connect to MongoDB:', error);
        throw error;
    }

    return cached.conn;
};

module.exports = connectDB;
