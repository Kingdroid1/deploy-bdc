const express = require('express');
const router = express.Router();

const timeController = require('./../../controllers/time-mgt');
const validateToken = require('./../../helpers/validateToken');

router.route('/')
  .post(validateToken.verifyToken, timeController.createTime);

router.get('/seed',  timeController.seedTimes);

router.get('/', timeController.getTimes);

router.get('/gettime/:id', timeController.getTimeById);

router.get('/gettime', timeController.getTimeUnit);

router.get('/health', (req, res) => {
  res.send('OK');
});

module.exports = router;