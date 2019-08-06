const express = require('express');
const router = express.Router();

const locationControler = require('./../../controllers/location');
const validateToken = require('./../../helpers/validateToken');

router.route('/').post(validateToken.verifyToken, locationControler.createLocation);

router.route('/location/:id').get(validateToken.verifyToken, locationControler.getLocationById);

router.get('/seed', locationControler.seedLocations);

router.route('/')
    .get(locationControler.getLocations);

router.route('/location/:id').put(validateToken.verifyToken, locationControler.updateLocation);

router.route('/location/:id').delete(validateToken.verifyToken, locationControler.deleteLocation);

router.get('/test', (req, res) => {
    res.send('Location Works');
});

module.exports = router;