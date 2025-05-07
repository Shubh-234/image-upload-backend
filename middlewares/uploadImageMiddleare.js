const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        // Ensure the uploads folder exists and is accessible
        cb(null, path.join(__dirname, "../uploads")); // Use relative path to your project
    },
    filename: function (req, file, cb) {
        // Store file with a timestamp to ensure unique filenames
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const checkFileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image")) {
        cb(null, true); // Allow images
    } else {
        cb(new Error('File can only accept images'), false); // Reject non-image files
    }
};

module.exports = multer({
    storage: storage,
    fileFilter: checkFileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // Max size: 5MB
    }
});
