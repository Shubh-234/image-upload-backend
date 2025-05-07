const Image = require('../models/image.model')
const uploadToCloudinary = require('../helper/imageHelper')
const cloudinary = require('../config/cloudinaryConfig');
const uploadImage = async (req,res) => {
    console.log(Image);
    try {
        if(!req.file){
            res.status(400).json({
                success : false,
                message: "No file, Please provide a file"
            })
        }
        const {publicId,url} =await uploadToCloudinary(req.file.path);
        const userId = req.userInfo.userId;

        console.log(Image)
        const newImage = new Image({
            publicId,
            url,
            uploadedBy : userId 
        })

        await newImage.save();
        res.status(201).json({
            success: true,
            message: "Imaged uploaded successfully",
            image: newImage,
          });
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message : "Internal server error"
        })
    }
}

const fetchImages = async (req,res) => {
    try {

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 2;
        const skip = (page-1)*limit;

        const sortBy = req.query.sortBy || "createdAt";
        const sortOrder = req.query.sortOrder === "asc" ? 1 : -1;

        const totalImages = await Image.countDocuments();
        const totalPages = Math.ceil(totalImages/limit);

        const sortObject = {};
        sortObject[sortBy] = sortOrder;

        const images = await Image.find().sort(sortObject).skip(skip).limit(limit);

        res.status(200).json({
            success : true,
            currentPage : page,
            limit : limit,
            totalPages : totalPages,
            message : "Images fetched successfully",
            data: images
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success : false,
            message : 'Internal server error'
        })
    }
}

const deleteImage = async (req,res) => {
    try {
        const imageId = req.params.id;
        const imageTodetelte = await Image.findById(imageId);

        const userId = req.userInfo.userId;

        if(!imageTodetelte){
            return res.status(400).json({
                success : false,
                message : "Image not found"
            })
        }

        const checkUploader = () => {
            const uploaderId = imageTodetelte.uploadedBy;
            if(userId !== uploaderId){
                return false;
            }

            return true;
        }

        if(!checkUploader){
            res.status(403).json({
                success : false,
                message : "You are not authorized to delete this image"
            })
        }

        await cloudinary.uploader.destroy(imageTodetelte.publicId);

        await Image.findByIdAndDelete(imageId);

        return res.status(202).json({
            success : true,
            message : "Image deleted successfully"
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success : false,
            message :"Internal server error"
        })
    }
}

module.exports = {uploadImage,fetchImages,deleteImage}