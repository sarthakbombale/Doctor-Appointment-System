const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");

// 1. Force the configuration into the v2 instance
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

// 2. Wrap the storage in a try-catch to see if it's failing here
let storage;
try {
  storage = new CloudinaryStorage({
    cloudinary: cloudinary, // Use the configured instance
    params: {
      folder: "doctor_app_profiles",
      allowed_formats: ["jpg", "jpeg", "png"],
      public_id: (req, file) => `profile-${Date.now()}`
    },
  });
} catch (err) {
  console.error("Cloudinary Storage Initialization Error:", err);
}

const upload = multer({ storage });
module.exports = upload;