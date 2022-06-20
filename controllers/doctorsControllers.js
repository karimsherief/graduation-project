// Schema
const Patient = require('../models/patients');
const Doctor = require('../models/users');
const DoctorVerification = require('../models/DoctorVerification');
const PasswordReset = require('../models/PasswordRest');

const bcrypt = require('bcrypt');


const GUI = (req, res) => {
    const id = req.originalUrl.substring(8, 32);
    Doctor
        .findById({ _id: id })
        .then((docInfo) => res.render('GUI', { title: 'Breast cancer Prediction', doctor: docInfo, css: "GUI" }))
        .catch(e => console.log(e))

}

const patientsData = (req, res) => {
    const id = req.originalUrl.substring(8, 32);

    Patient
        .find()
        .sort({ createdAt: -1 })
        .then(result => {
            Doctor
                .findById({ _id: id })
                .then((docInfo) => res.render('patientsdata', { title: 'Patients data', patients: result, doctor: docInfo, css: "patientsData" }))
                .catch(e => console.log(e))
        })
        .catch(err => console.log(err));
}

const accountSettings = (req, res) => {
    const id = req.originalUrl.substring(8, 32);

    const doctor = Doctor
        .findOne({ _id: id })
        .then((result) => res.render('accountsettings', { title: 'Account settings', doctor: result, css: "accountSettings" }))
        .catch(err => console.log(err));
}

const get_changepassword = (req, res) => {
    const id = req.originalUrl.substring(8, 32);

    res.render('changepassword', { title: 'Change password', id: id, css: "changePassword", message: "" })
}

const update_changepassword = (req, res) => {
    const id = req.originalUrl.substring(8, 32); 
    const first = req.body.password[0];
    const second = req.body.password[1];

    if (first === "" || second === "") {
        res.render('changepassword', { title: 'Change password', id: id, css: "changePassword", message: "Fields can't be empty" })
    } else if (first == second) {
        const saltRounds = 10;
        bcrypt
            .hash(first, saltRounds)
            .then((hashedNewPassword) => {

                Doctor
                    .updateOne({ _id: id }, { password: hashedNewPassword })
                    .then(() => {
                        res.redirect('accountsettings');
                    })
                    .catch(e => console.log(e));
            })
            .catch(e => console.log(e));

    } else {
        res.render('changepassword', { title: 'Change password', id: id, css: "changePassword", message: "Password doesn't match" })
    }
}

// verifed page
const get_verify = (req, res) => res.render('verified', { css: "verify", title: "Email Verified" });

// verify email
const post_verify = (req, res) => {
    let { doctorId, uniqueString } = req.params;

    DoctorVerification
        .find({ doctorId })
        .then((result) => {

            if (result.length > 0) {
                // user verification record exist
                const { expiresAt } = result[0];
                const hashedUniqueString = result[0].uniqueString;

                // check for expire unique string 
                if (expiresAt < Date.now()) {
                    // record has expired
                    DoctorVerification
                        .deleteOne({ doctorId })
                        .then(() => {
                            Doctor
                                .deleteOne({ _id: doctorId })
                                .then(() => {
                                    let message = "Link expired";
                                    res.redirect(`/doctor/verified/error=true&message=${message}`);
                                })
                                .catch(() => {
                                    let message = "Errow while clearing expired user with unique string";
                                    res.redirect(`/doctor/verified/error=true&message=${message}`);
                                });
                        })
                        .catch(() => {
                            let message = "Errow while clearing expired user";
                            res.redirect(`/doctor/verified/error=true&message=${message}`);
                        });
                } else {
                    // vaild record exist
                    // Compare the hashed unique string 
                    bcrypt
                        .compare(uniqueString, hashedUniqueString)
                        .then(result => {
                            if (result) {
                                // string match
                                Doctor
                                    .updateOne({ _id: doctorId }, { verified: true })
                                    .then(() => {
                                        DoctorVerification
                                            .deleteOne({ doctorId })
                                            .then(() => {
                                                res.render('verified', { css: "verify", title: "Email Verified" });
                                            })
                                            .catch(() => {
                                                let message = "Errow while finializing";
                                                res.redirect(`/doctor/verified/error=true&message=${message}`);
                                            });
                                    })
                                    .catch(() => {
                                        let message = "Errow while clearng updating";
                                        res.redirect(`/doctor/verified/error=true&message=${message}`);
                                    });
                            } else {
                                // incorrect verification
                                let message = "Invalid verification";
                                res.redirect(`/doctor/verified/error=true&message=${message}`);
                            }
                        })
                        .catch(() => {
                            let message = "Errow while comparing ";
                            res.redirect(`/doctor/verified/error=true&message=${message}`);
                        });

                }
            } else {
                let message = "Account record doesn't exist";
                res.redirect(`/doctor/verified/error=true&message=${message}`);
            }
        })
        .catch((e) => {
            console.log(e);
            let message = 'Error while checking exisiting User';
            res.redirect(`/doctor/verified/error=true&message=${message}`);
        });
}


// reset password 
const get_resetpassword = (req, res) => {
    const id = req.originalUrl.substring(22, 46);
    const resetString = req.originalUrl.substring(47);

    res.render('resetpassword', { title: "Reset password", id: id, resetString: resetString, css: "changePassword" });
}

const post_resetpassword = (req, res) => {
    const id = req.originalUrl.substring(22, 46);
    const resetString = req.originalUrl.substring(47);
    const { newPassword } = req.body;

    PasswordReset
        .find({ doctorId: id })
        .then(result => {
            if (result.length > 0) {
                const { expiresAt } = result[0];
                const hashedResetString = result[0].resetString;
                if (expiresAt < Date.now()) {
                    PasswordReset
                        .deleteOne({ id })
                        .then((r) => console.log(r))
                        .catch(e => console.log(e));
                } else {
                    bcrypt
                        .compare(resetString, hashedResetString)
                        .then(result => {
                            if (result) {
                                const saltRounds = 10;
                                bcrypt
                                    .hash(newPassword, saltRounds)
                                    .then(hashedNewPassword => {
                                        Doctor
                                            .updateOne({ _id: id }, { password: hashedNewPassword })
                                            .then(() => {
                                                PasswordReset
                                                    .deleteOne({ id })
                                                    .then(() => res.render('login', { title: "Login", message: "Password changed successfully you can now login to your account", color: "green", css: "login" }))
                                                    .catch(e => console.log(e));
                                            })
                                            .catch(e => conosle.log(e))
                                    })
                                    .catch(e => console.log(e))
                            } 
                        })
                        .catch(e => console.log(e));
                }
            } 
        })
        .catch(e => console.log(e));
};

module.exports = {
    GUI,
    patientsData,
    accountSettings,
    get_verify,
    post_verify,
    get_changepassword,
    update_changepassword,
    get_resetpassword,
    post_resetpassword
}
