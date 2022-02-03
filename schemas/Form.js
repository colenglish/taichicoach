const mongoose = require('mongoose');
const Movement = require('./Movement');

const FormSchema = new mongoose.Schema({
    formId: { type: String },
    name: { type: String },
    style: { type: String },
    videos: [{
        teacher: { type: String },
        youtubeVideoId: { type: String },
        movementDurations: [[{type: Number}]]
    }],
    movements: [Movement.schema]
});

module.exports = mongoose.model("Form", FormSchema);