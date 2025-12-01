const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const jokeViewedSchema = new Schema({
    category: { type: String, required: true },
    count: { type: Number, default: 0 }
}, { _id: false });


const userSchema = new Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    preferredLanguage: { type: String, default: 'en' },
    lastLogin: { type: Date },
    totalLoggedSeconds: { type: Number, default: 0 },
    jokesViewed: { type: [jokeViewedSchema], default: [] }
}, { timestamps: true });


module.exports = mongoose.model('User', userSchema);