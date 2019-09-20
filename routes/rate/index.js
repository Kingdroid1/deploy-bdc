const express = require('express');
const router = express.Router();

const rateController = require('../../controllers/rateManagement');
const validateToken = require('./../../helpers/validateToken');

router.route('/')
  .post(rateController.addRate);

router.route('/listrates')
  .get( rateController.listRate);

router.route('/?')
  .get(rateController.getRate);

  router.route('/scroll')
  .get(rateController.scrollingRate);
  
router.route('/csv?')
  .get(rateController.csvRate);

router.get('/history', rateController.historicalRate);

router.get('/mobile?', rateController.mobileRate);

router.get('/mobilehistory', rateController.mobilehistoricalRate);

router.get('/seed', rateController.seedRate);

router.route('/:userId').get(rateController.getRatebyUserId);

module.exports = router;