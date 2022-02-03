const mongoose = require('mongoose');

var MovementSchema = new mongoose.Schema({
    name: { type: String },
    description: { type: String, default: "Eat bitter." },
    repetitions: { type: Number, default: 1 },
    repetition_duration: { type: Number }
});

module.exports = mongoose.model('Movement', MovementSchema);