const express = require('express');

const app = express();

const router = express.Router();

const advertController = require ('../../controllers/adverts');

router.get('/', advertController.listAdvert);

router.get('/:id', advertController.getAdvert);

router.post('/', advertController.createAdvert);

router.put('/:id', advertController.updateAdvert);

router.delete('/:id', advertController.deleteAdvert);

router.get('health', (req, res) => {
  res.send('OK');
});

module.exports = router;