const express = require('express')
const patientsControllers = require('../controllers/patientsControllers')

const router = express.Router();

router.get('/prediction',patientsControllers.getPrediction);

router.post('/prediction',patientsControllers.postPrediction);

module.exports = router;
