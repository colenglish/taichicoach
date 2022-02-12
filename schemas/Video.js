const mongoose = require('mongoose');

var VideoSchema = new mongoose.Schema({
    practitioner: { type: mongoose.Schema.Types.ObjectId, ref: 'Practitioner' },
    videoId: { type: String },
    source: { type: String, enum: ['youtube', 'vimeo'] },
    start: { type: Number },
    end: { type: Number }
});

module.exports = mongoose.model('Video', VideoSchema);