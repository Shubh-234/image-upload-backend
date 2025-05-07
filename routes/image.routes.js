const express = require('express');
const router = express.Router();
const protectedRoute = require('../middlewares/authMiddleware')
const roleBased = require('../middlewares/roleMiddleware')
const {uploadImage,fetchImages,deleteImage} = require('../controllers/imageController')
const uploadMiddleware = require('../middlewares/uploadImageMiddleare')

router.post('/upload',protectedRoute,roleBased,uploadMiddleware.single('image'),uploadImage)
router.get('/get',protectedRoute,fetchImages);

router.delete('/delete/:id',protectedRoute,roleBased,deleteImage);

module.exports = router;