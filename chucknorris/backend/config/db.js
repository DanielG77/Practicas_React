const mongoose = require('mongoose');


const connectDB = async () => {
    try {
        const uri = process.env.MONGO_URI;
        if (!uri) throw new Error('MONGO_URI no està definida');
        await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log('MongoDB connectat');
    } catch (err) {
        console.error('Error connectant a MongoDB:', err.message);
        process.exit(1);
    }
};


module.exports = connectDB;