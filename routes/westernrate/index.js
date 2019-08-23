const express = require('express');
const router = express.Router();

const westernController = require('../../controllers/westernrate');

router.post("/", westernController.addRates);

router.get("/westernrate", westernController.getRates);

module.exports = router;