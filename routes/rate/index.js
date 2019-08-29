const express = require('express');
const router = express.Router();

const rateController = require('../../controllers/rateManagement');
const validateToken = require('./../../helpers/validateToken');

router.route('/')
  .post(validateToken.verifyToken, rateController.addRate);

router.route('/listrates')
  .get(validateToken.verifyToken, rateController.listRate);

router.route('/?')
  .get(rateController.getRate);

  router.route('/scroll')
  .get(rateController.getScrollRate);
  
router.route('/csv?')
  .get(rateController.csvRate);

router.get('/history', rateController.historicalRate);

router.get('/seed', rateController.seedRate);

module.exports = router;