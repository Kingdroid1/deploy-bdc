const express = require('express');
const app = express();
const router = express.Router();
const Advert = require('../../models/adverts');
const mongoose = require("mongoose");

// const bodyParser = require('body-parser')
// var http = require("http");
// import cloudinary from '../../controllers/cloudinaryConfig'
const advertController = require ('../../controllers/adverts');
const { upload } = require('../../helpers/multer');
// var corsOptions = {
//   origin: 'https://api.cloudinary.com/v1_1/ebunola/image/upload',
//   optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
// }




router.post('/upload', upload.single('advertImage'), advertController.createAdvert);

// router.get('/', advertController.getAllAdverts);
router.get('/', advertController.getAdverts);

// router.post('/', upload.single('advertImage'), advertController.createAdvert);

router.get('/seed', advertController.seedImage);

router.get('/:id', advertController.getAdvertById);

router.put('/:id', advertController.updateAdvert);

router.delete('/:id', advertController.deleteAdvert);

router.get('health', (req, res) => {
  res.send('OK');
});

module.exports = router;