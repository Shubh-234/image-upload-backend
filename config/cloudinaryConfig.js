const cloudinary = require('cloudinary').v2;

cloudinary.config({ 
    cloud_name: 'dpbhmzoc8', 
    api_key: '526738889895543', 
    api_secret: 'Rk-uzd41bzW_P6wepgq3e8AyH70' // Click 'View API Keys' above to copy your API secret
});

module.exports = cloudinary