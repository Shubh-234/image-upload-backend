const cloudinary = require('../config/cloudinaryConfig');


const uploadToCloudinary = async (filePath) => {
    try {
        const result = await cloudinary.uploader.upload(filePath);
        const {public_id,secure_url} = result;
        return {
            publicId : public_id,
            url: secure_url,

        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message : "something went wrong"
        })
    }
}

module.exports = uploadToCloudinary