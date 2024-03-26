const mongoose = require('mongoose');


const connectToMongoDB = async () => {
    try {
        await mongoose.connect('mongodb+srv://pk497243:pk497243@cluster0.i9hw1xi.mongodb.net/pinki?retryWrites=true&w=majority&appName=Cluster0');
        console.log('Connected!');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
    }
}


module.exports = {connectToMongoDB};




