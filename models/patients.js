const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const patientsSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    result: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    email: String,
    doctoremail: String
}, { timestamps: true });

const Patient = mongoose.model('Patient', patientsSchema);
module.exports = Patient;


