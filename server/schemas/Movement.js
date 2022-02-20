const mongoose = require('mongoose');

var MovementSchema = new mongoose.Schema({
    name: { type: String },
    description: { type: String },
    videos: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Video' }],
    repetitions: { type: Number, default: 1 },
    repetition_duration: { type: Number }
});

module.exports = mongoose.model('Movement', MovementSchema);