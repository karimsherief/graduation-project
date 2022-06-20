// Schema
const DoctorVerification = require('../models/DoctorVerification');
const PasswordReset = require('../models/PasswordRest');
const Doctor = require('../models/users');

const { v4: uuidv4 } = require('uuid');

const bcrypt = require('bcrypt');

const nodemailer = require('nodemailer');

require('dotenv').config();


let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.AUTH_EMAIL,
        pass: process.env.AUTH_PASS,
    },
});

transporter.use()

// Login

const get_login = (req, res) => res.render('login', { title: 'Login', message: "", color: "", css: "login" });

const post_login = (req, res) => {
    let { email, password } = req.body;
    email = email?.trim().toLowerCase();
    password = password?.trim();

    if (email == "" || password == "") {
        res.render('login', { title: "login", message: "Fields can't be empty", color: "red", css: "login" });
    } else {
        //Check if user exists
        Doctor
            .find({ email })
            .then(data => {
                if (data.length) {
                    // User exists

                    // check if user is verified
                    if (!data[0].verified) {
                        res.render('login', { title: "login", message: "Email isn't verified", color: "red", css: "login" });
                    } else {
                        const hashedPassword = data[0].password;
                        bcrypt
                            .compare(password, hashedPassword)
                            .then(result => {
                                if (result) {
                                    // Password match
                                    const id = data[0]._id;
                                    res.redirect(`/doctor/${id}/patientsData`);
                                } else {
                                    res.render('login', { title: "login", message: "Invalid password", color: "red", css: "login" });
                                }
                            })
                            .catch(() => {
                                res.json({
                                    status: "Failed",
                                    message: "Error while comparing passwords"
                                });
                            })
                    }
                } else {
                    res.render('login', { title: "login", message: "Invalid email or password", color: "red", css: "login" });
                }
            })
            .catch(() => {
                res.render('login', { title: "login", message: "Email not found", color: "red", css: "login" });
            });
    }
}

// Sing up
const get_signup = (req, res) => res.render('signup', { title: 'Sign Up', message: "", css: "signup" });

const post_signup = (req, res) => {
    let { name, email, natId, password } = req.body;
    name = name?.trim()
    email = email?.trim().toLowerCase();
    natId = natId?.trim();
    password = password?.trim();


    // Check if user already exists
    Doctor
        .find({ email })
        .then(result => {
            if (result.length) {
                // A user already exist
                res.render('signup', { title: "sign Up", message: "Email already exist", css: "signup" });
            } else {
                // Try to create new user

                // Password handling
                
                const saltRounds = 10; ///
                bcrypt
                    .hash(password, saltRounds)
                    .then(hashedPassword => {
                        const newDoctor = new Doctor({
                            name,
                            email,
                            natId,
                            password: hashedPassword,
                            verified: false
                        });

                        newDoctor
                            .save()
                            .then(result => {
                                /// handle account verification
                                sendVerificationEmail(result, res, req);
                            })
                            .catch(() => {
                                res.render('signup', { title: "sign Up", message: "Error while saving account", css: "signup" });
                            });
                    })
                    .catch(() => {
                        res.render('signup', { title: "sign Up", message: "Error while handling password", css: "signup" });
                    })
            }
        })
        .catch((e) => {
            res.render('signup', { title: "sign Up", message: "Error while checking existing user", css: "signup" });
        });

}

// send verification email 
const sendVerificationEmail = ({ _id, email }, res, req) => {
    // url to be used in email
    const url = req.protocol + '://' + req.get('host')+'/';
    const uniqueString = uuidv4() + _id;

    // mail options
    const mailOptions = {
        from: process.env.AUTH_EMAIL, 
        to: email,
        subject: 'Verify your email',
        html: `<p>Verify your email address to complete signup and login into your account.</p>
        <p>This link <b>expires in 6 hours</b>.</p><p>Click <a href=${url + 'doctor/verify/' + _id + '/' + uniqueString}>here</a>
        to proceed.</p>`
    };

    // hash the uniqueString
    const saltRounds = 10;
    bcrypt
        .hash(uniqueString, saltRounds)
        .then(hashedUniqueString => {
            // set values in userVerification collection 
            const newVerification = new DoctorVerification({
                doctorId: _id,
                uniqueString: hashedUniqueString,
                createdAt: Date.now(),
                expiresAt: Date.now() + 21600000
            });

            newVerification
                .save()
                .then(() => {
                    transporter
                        .sendMail(mailOptions)
                        .then(() => {
                            // email sent and verification record saved
                            res.render('backtosite', { title: "Check your email", message: "Verification email sent check your email", css: "backToSite" });
                        })
                        .catch((e) => {
                            console.log(e)
                            res.json({
                                status: 'Failed',
                                message: 'Error while sendding message'
                            })
                        })
                })
                .catch(() => {
                    res.json({
                        status: 'Failed',
                        message: 'Error while saving'
                    })
                })
        })
        .catch(() => {
            res.json({
                status: 'Failed',
                message: 'Error while Hashing'
            })
        })
};

const backtosite = (req, res) => res.render('backtosite', { title: "Back to site", message: "", css: "backToSite" });

const get_forgetpassword = (req, res) => res.render('forgetpassword', { title: "Forget Password", message: "", css: "changePassword" });

const post_forgetpassword = (req, res) => {
    const { email } = req.body;

    // Check if email exist
    Doctor
        .find({ email })
        .then((data) => {
            if (data.length) {
                // check if user verified

                if (!data[0].verified) {
                    res.render('forgetpassword', { title: "Forget Password", message: "account not verified", css: "changePassword" });
                } else {
                    sendResetEmail(data[0], res, req);
                }
            } else {
                res.render('forgetpassword', { title: "Forget Password", message: "Email doesn't exist", css: "changePassword" });
            }
        })
        .catch(e => console.log(e));
}
// send password reset email
const sendResetEmail = ({ _id, email }, res , req) => {
    const resetString = uuidv4() + _id;
    const url = req.protocol + '://' + req.get('host')+'/' ;

    PasswordReset
        .deleteMany({ doctorId: _id })
        .then(() => {
            // mail options
            const mailOptions = {
                from: process.env.AUTH_EMAIL,
                to: email,
                subject: 'Reset password',
                html: `<p>We heard that you lost the password.</p><p>Don't worry, user the link below to reset it.</p>
                        <p>This link <b>expires in 1 hour</b>.</p><p>Click <a href=${url + 'doctor/resetpassword/' + _id + '/' + resetString}>here</a>
                        to proceed.</p>`
            };
            //hash the reset string
            const saltRounds = 10;
            bcrypt
                .hash(resetString, saltRounds)
                .then(hashedResetString => {
                    const newPasswordReset = new PasswordReset({
                        doctorId: _id,
                        resetString: hashedResetString,
                        createdAt: Date.now(),
                        expiresAt: Date.now() + 3600000
                    });
                    newPasswordReset
                        .save()
                        .then(() => {
                            transporter
                                .sendMail(mailOptions)
                                .then(() => {
                                    res.render('backtosite', { title: "Back to site", message: "Check your email", css: "backToSite" })
                                })
                                .catch(e => console.log(e));
                        })
                        .catch(e => console.log(e));
                })
                .catch(e => console.log(e));
        })
        .catch(e => {
            console.log(e);
        });
}

module.exports = {
    get_login,
    post_login,
    get_signup,
    post_signup,
    backtosite,
    get_forgetpassword,
    post_forgetpassword,
}