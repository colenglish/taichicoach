const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const crypto = require('crypto'); // many favour this built in crypto than bcrypt (should consider slow hashing to discourage brute force attacks)

const UserSchema = new mongoose.Schema({
    firstName: { type: String },
    lastName: { type: String },
    email: { type: String, lowercase: true, unique: true, required: [true, "can't be blank"], match: [/\S+@\S+\.\S+/, 'is invalid'], index: true },
    hash: { type: String, required: true },
    salt: { type: String, required: true },
    admin: { type: Boolean, default: false }

}, {timestamps: true});

UserSchema.plugin(uniqueValidator, { message: 'is already taken.' });

UserSchema.methods.setPassword = function(password) {
    this.salt = crypto.randomBytes(16).toString('hex');
    this.hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
};

UserSchema.methods.comparePassword = function(password) {
    var hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
    return this.hash === hash;
};

module.exports = mongoose.model('User', UserSchema);