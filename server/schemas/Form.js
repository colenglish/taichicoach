const mongoose = require('mongoose');
const Movement = require('./Movement');

const FormSchema = new mongoose.Schema({
    formId: { type: String },
    name: { type: String },
    style: { type: String },
    videos: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Video' }],
    movements: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Movement' }]
});

module.exports = mongoose.model("Form", FormSchema);