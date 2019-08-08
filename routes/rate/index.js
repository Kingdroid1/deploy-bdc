const express = require('express');
const router = express.Router();

const rateController = require('../../controllers/rateManagement');
const validateToken = require('./../../helpers/validateToken');

router.route('/')
  .post(rateController.addRate);

router.route('/listrates')
  .get(rateController.listRate);

router.get('/', rateController.getRate);

module.exports = router;