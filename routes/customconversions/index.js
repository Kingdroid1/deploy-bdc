const express = require('express');
const router = express.Router();

const {seedconversion,getcustomconversions, getusdrate, getgbprate, geteurrate, getyenrate } = require('./../../controllers/customconverter');

router.get('/seed', seedconversion);

router.get('/', getcustomconversions);

router.post('/usd', getusdrate);

router.post('/gbp', getgbprate);

router.post('/eur', geteurrate);

router.post('/yen', getyenrate);

module.exports = router;