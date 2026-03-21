const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");

// Configure Cloudinary with your keys
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "doctor_app_profiles", // This creates a specific folder in your Cloudinary account
    allowed_formats: ["jpg", "jpeg", "png"],
    public_id: (req, file) => `profile-${Date.now()}`, 
  },
});

const upload = multer({ storage });

module.exports = upload;