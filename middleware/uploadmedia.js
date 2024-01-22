const multer = require('multer');
const { Storage } = require('@google-cloud/storage');
const MulterGoogleStorage = require('multer-google-storage').default;

const storage = new Storage({
  keyFilename: "../amiable-octane-375722-a20e65eb5c57.json",
});

const bucketName = 'lead4earth'; // Your bucket name

const multerStorage = new MulterGoogleStorage({
  projectId: 'amiable-octane-375722',
  keyFilename: "../amiable-octane-375722-a20e65eb5c57.json",
  googleStorage: storage,
  bucket: bucketName,
  filename: function (req, file, cb) {
    const filename = file.fieldname + '-' + Date.now() + '.' + file.mimetype.split('/')[1];
    cb(null, filename);
  },
});

// Middleware for single file upload
const uploadSingle = multer({ storage: multerStorage }).single('image');

// Middleware for multiple file uploads
const uploadMultiple = multer({ storage: multerStorage }).array('media', 5);

module.exports = { uploadSingle, uploadMultiple };
