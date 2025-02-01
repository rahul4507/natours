
const mongoose = require('mongoose');
const validator = require('validator')
var bcrypt = require('bcryptjs');

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
        select: false
    },
    photo: String,
    passwordConfirm: {
        type: String,
        required: [true, "Please confirm your password"],
        validate: {
            // this will work on only save and create 
            validator: function (el) {
                return el == this.password;
            }
        },
        message: "Passwords are not same!!"
    }
});

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();

    this.password = await bcrypt.hash(this.password, 12);

    this.passwordConfirm = undefined;
    next()
})

userSchema.methods.correctPassword = async function (candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword);
}



const User = mongoose.model('User', userSchema);

module.exports = User;
