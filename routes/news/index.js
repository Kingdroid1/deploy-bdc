const express = require('express');

const app = express();

const router = express.Router();

const newsController = require ('../../controllers/news');

router.get('/', newsController.listNews);

router.get('/:id', newsController.getNews);

router.post('/', newsController.createNews);

router.put('/:id', newsController.updateNews);

router.delete('/:id', newsController.deleteNews);

router.get('health', (req, res) => {
  res.send('OK');
});

module.exports = router;