const express = require('express');

const app = express();

const router = express.Router();

const newsController = require ('../../controllers/news');

router.get('/', newsController.listNews);

router.get('/fetch', newsController.createNews);

// router.get('/:id', newsController.getNews);

// router.put('/:id', newsController.updateNews);

// router.delete('/:id', newsController.deleteNews);

router.get('health', (req, res) => {
  res.send('OK');
});

module.exports = router;