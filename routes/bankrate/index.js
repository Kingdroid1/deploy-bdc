const express = require('express');
const router = express.Router();

const bankController = require('../../controllers/bankrate');

router.post("/bankrate", bankController.addRates);

router.get("/bankrate", bankController.getRates);

module.exports = router;