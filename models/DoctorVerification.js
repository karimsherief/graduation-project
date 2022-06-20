const mongoose = require('mongoose');
const Schema =  mongoose.Schema;

const DoctorVerificationSchema = new Schema({
    doctorId: String,
    uniqueString: String,
    createdAt: Date,
    expiresAt: Date,
});

const DoctorVerification = mongoose.model('DoctorVerification',DoctorVerificationSchema);

module.exports = DoctorVerification;


