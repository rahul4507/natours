const mongoose = require('mongoose');
const validator = require('validator');
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
        minlength: 8,
        select: false
    },
    role: {
        type: String,
        enum: ['user', 'guide', 'lead-guide', 'admin'],
        default: 'user'
    },
    photo: String,
    passwordConfirm: {
        type: String,
        required: [true, "Please confirm your password"],
        validate: {
            // this will work on only save and create 
            validator: function (el) {
                return el == this.password;
            },
            message: "Passwords are not same!!"
        }
    },
    passwordChangedAt: Date
});

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();

    this.password = await bcrypt.hash(this.password, 12);

    this.passwordConfirm = undefined;

    // Set passwordChangedAt to the current date
    this.passwordChangedAt = Date.now() - 1000; // Subtract 1 second to ensure the token is created after this field is set

    next();
});

userSchema.methods.correctPassword = async function (candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword);
}

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
    if (this.passwordChangedAt) {
        const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
        return JWTTimestamp < changedTimestamp;
    }
    return false;
}

const User = mongoose.model('User', userSchema);

module.exports = User;
