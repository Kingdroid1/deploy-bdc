const express = require('express');
const app = express();
const router = express.Router();

const operatorController = require ('./../../controllers/bdcoperators');
const validateToken = require('./../../helpers/validateToken');

router.get('/operators', operatorController.listOperators);

router.get('/operator/:id', operatorController.getOperator);

router.post('/addoperator', operatorController.createOperator);

router.put('/operator/:id', operatorController.updateOperator);

router.delete('/operator/:id', operatorController.deleteOperator);

router.get('/health', (req, res) => {
  res.send('OK');
});

module.exports = router;