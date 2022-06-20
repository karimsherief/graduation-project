const express = require('express')
const doctorsControllers = require('../controllers/doctorsControllers')

const router = express.Router();

router.get('/:id/prediction', doctorsControllers.GUI);

router.get('/:id/patientsdata', doctorsControllers.patientsData);

router.get('/:id/accountsettings', doctorsControllers.accountSettings);

router.get('/:id/changepassword', doctorsControllers.get_changepassword);

router.post('/:id/changepassword', doctorsControllers.update_changepassword);

// verify email
router.get('/verify/:doctorId/:uniqueString', doctorsControllers.post_verify);

// verifed page
router.get('/verified', doctorsControllers.get_verify);

// reset password 
router.get('/resetpassword/:id/:resetString', doctorsControllers.get_resetpassword);

router.post('/resetpassword/:id/:resetString', doctorsControllers.post_resetpassword);

module.exports = router;
