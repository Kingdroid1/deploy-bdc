const express = require ('express')
const router = express.Router();
const suscribecontroller = require('../../controllers/suscribe');

router.get('/:email', suscribecontroller.suscribe);
router.post('/', suscribecontroller.suscribed);

module.exports = router;