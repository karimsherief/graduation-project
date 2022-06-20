// Schema
const Doctor = require('../models/users');
const Patient = require('../models/patients');

const getPrediction =  (req, res) => {

    Doctor
        .find()
        .then(result => {
            res.render('patientsGUI', { title: 'Breast cancer prediction', Doctors: result, css: "patientsGUI" });
        })
        .catch(err => console.log(err));

};

const postPrediction =  (req, res) => {
    const data = req.body;

    const newPatient = new Patient({
        name: data.name,
        phone: data.phone,
        email: data.email,
        result: data.result,
        doctoremail: data.doctoremail
    });

    newPatient
        .save()
        .then(() => res.redirect('prediction'))
        .catch(e => console.log(e));

};

module.exports = {
    getPrediction,
    postPrediction,
}
