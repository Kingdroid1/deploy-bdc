const express = require('express');
const router = express.Router();

const cbnController = require('../../controllers/cbnscrapper');

router.get("/", cbnController.cbnRates);

module.exports = router;