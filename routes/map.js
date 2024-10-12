const express = require('express');
const router = express.Router();
const { getNearbyDoctors } = require('../controllers/mapController');

router.get('/nearby-doctors', getNearbyDoctors);

module.exports = router;