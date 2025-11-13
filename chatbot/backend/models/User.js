const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    online: { type: Boolean, default: false },
    image: { type: String, default: 'https://robohash.org/default.png' }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
