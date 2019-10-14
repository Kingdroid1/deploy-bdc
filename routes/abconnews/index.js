const express = require('express');
const router = express.Router();

const newscontroller = require('../../controllers/abconnews');

router.post('/newsupload', newscontroller.saveNews);

router.get('/', newscontroller.getAllNews);

router.get('/:id', newscontroller.getNewsById);

router.delete('/:id', newscontroller.deleteNews);

router.get('health', (req, res) => {
    res.send('OK');
  });

module.exports = router;