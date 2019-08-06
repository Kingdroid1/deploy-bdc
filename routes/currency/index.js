const express = require('express');
const router = express.Router();

const currencyController = require('./../../controllers/currency');
const validateToken = require('./../../helpers/validateToken');

router.route('/')
  .post(validateToken.verifyToken, currencyController.addCurency);

router.get('/seed',  currencyController.seedCurrency);

router.get('/', currencyController.listCurrency);

router.route('/updatecurrency/:id')
  .put(validateToken.verifyToken, currencyController.updateCurrency);

router.route('/deletecurrency/:id')
  .delete(validateToken.verifyToken, currencyController.deleteCurrency);

module.exports = router;