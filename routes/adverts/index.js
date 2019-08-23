const express = require('express');
const app = express();
const router = express.Router();
const multer = require("multer");

// const {static} = require('express');
// app.use('/advertImages/', static('../Bdc-Frontend/public/advertImages'))
// const getRates = require('../../../Bdc-Frontend/public/advertImages')
const advertController = require ('../../controllers/adverts');

// Set Storage Engine using multer
const storage = multer.diskStorage({
  destination: function(req, file, cb){
  cb(null, '../Bdc-Frontend/public/advertImages')
},
  filename: function (req, file, cb) {        
      // null as first argument means no error
      cb(null, Date.now() + '-' + file.originalname )
      console.log("File argument", file)
  }  
});

// define the file filter specifics
const fileFilter = (req, file, cb) => {
	if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
	cb(null, true);
}else {
	cb(null, false);
}};

// Init upload
const upload = multer({
  storage: storage, 
  limits: {
      fileSize: 1024 *1024 * 5
  },
  fileFilter: fileFilter
})
// .single('advertImage');

router.get('/', advertController.getAllAdverts);

router.post('/', upload.single('advertImage'), advertController.createAdvert);

router.get('/seed', advertController.seedImage);

router.get('/:id', advertController.getAdvertById);

router.put('/:id', advertController.updateAdvert);

router.delete('/:id', advertController.deleteAdvert);

router.get('health', (req, res) => {
  res.send('OK');
});

module.exports = router;