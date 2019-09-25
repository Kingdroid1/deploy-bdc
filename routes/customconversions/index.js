const express = require('express');
const router = express.Router();

const customconversion = require('./../../controllers/customconverter');

router.get('/seed', customconversion.seedconversion);

router.get('/', customconversion.getcustomconversions);

router.post('/usdrate', customconversion.getusdrate);

router.post('/gbprate', customconversion.getgbprate);

router.post('/eurrate', customconversion.geteurrate);

router.post('/yenrate', customconversion.getyenrate);

module.exports = router;