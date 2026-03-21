const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");

// We wrap the config in a check to ensure variables exist
if (process.env.CLOUDINARY_NAME) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
} else {
  console.error("CRITICAL: Cloudinary environment variables are missing!");
}

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    return {
      folder: "doctor_app_profiles",
      allowed_formats: ["jpg", "jpeg", "png"],
      public_id: `profile-${Date.now()}`,
    };
  },
});

const upload = multer({ storage });
module.exports = upload;