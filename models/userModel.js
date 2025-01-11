
const mongoose = require('mongoose');
const validator = require('validator')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please tell us your name'],
    },
    email: {
        type: String,
        required: [true, "Please provide your email"],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, "Please Provide a Valid email"]
    },
    password: {
        type: String,
        required: [true, "Provide a password"],
        minlenght: 8,
    },
    photo: String,
    passwordConfirm: {
        type: String,
        required: [true, "Please confirm your password"]
    }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
