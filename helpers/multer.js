const multer = require("multer");

const fileFilter = (req, file, cb) => {
	if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
	cb(null, true);
}else {
	cb(null, false);
}};

const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: {
    fileSize: 1024 *1024 * 5
  },
  fileFilter: fileFilter
});

module.exports = { upload };