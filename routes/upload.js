const express = require('express');
const multer = require('multer');
const { Storage } = require('@google-cloud/storage'); // Updated import statement
const MulterGoogleStorage = require('multer-google-storage').default;


const storage = new Storage({
  keyFilename: "../amiable-octane-375722-a20e65eb5c57.json",
});

const multerStorage = new MulterGoogleStorage({
  projectId: 'amiable-octane-375722', // Add your project ID here
  keyFilename: "../amiable-octane-375722-a20e65eb5c57.json",
  googleStorage: storage,
  bucket: 'lead4earth',
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + '.' + file.mimetype.split('/')[1]);
  },
});

console.log("Upload Route Set");

const upload = multer({ storage: multerStorage });

const router = express.Router();

router.post('/', (req, res) => {
  upload.single('image')(req, res, (err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({
        success: false,
        message: 'Error occurred during file upload',
      });
    }

    if (req.file) {
      res.json({
        success: true,
        image_url: req.file.path,
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'No file uploaded',
      });
    }
  });
});



module.exports = router;
