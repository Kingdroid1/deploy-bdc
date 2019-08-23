const express = require('express');
const router = express.Router();

const rateController = require('../../controllers/rateManagement');
const validateToken = require('./../../helpers/validateToken');

router.route('/')
  .post( rateController.addRate);

router.route('/listrates')
  .get(rateController.listRate);

router.route('/')
  .get(rateController.getRate);

router.get('/seed', rateController.seedRate);

module.exports = router;