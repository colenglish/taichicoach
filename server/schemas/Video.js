const mongoose = require('mongoose');
const categories = ['form', 'principle', 'application', 'drill'];

var ClipSchema = new mongoose.Schema({
    ref: { type: String },
    category: { type: String, enum: categories },
    start: { type: Number },
    end: { type: Number }
});

var VideoSchema = new mongoose.Schema({
    practitioner: { type: mongoose.Schema.Types.ObjectId, ref: 'Practitioner' },
    videoId: { type: String },
    category: { type: String, enum: categories },
    source: { type: String, enum: ['youtube', 'vimeo'] },
    clips: [ClipSchema]
});

module.exports = mongoose.model('Video', VideoSchema);