const mongoose = require('mongoose');

var PractitionerSchema = new mongoose.Schema({
    name: { type: String },
    organisation: { type: String },
    orgLevel: { type: String, enum: ['Head','Senior', 'Junior'] },
    teachingLevel: { type: String },
    club: { type: String },
    teachers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Practitioner' }]//,
    //students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Practitioner' }]
});

module.exports = mongoose.model('Practitioner', PractitionerSchema);