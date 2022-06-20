const mongoose = require('mongoose');
const Schema =  mongoose.Schema;

const DoctorSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    natId: {
        type: Number,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    verified: Boolean
},{timestamps: true});

const Doctor = mongoose.model('Doctor',DoctorSchema);
module.exports = Doctor;


  