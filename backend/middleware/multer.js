const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const cloudName = process.env.CLOUDINARY_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

const isValidCloudinaryConfig = () => {
  if (!cloudName || !apiKey || !apiSecret) return false;
  const normalizedName = cloudName.trim().toLowerCase();
  if (normalizedName.includes("cloudinary_") || normalizedName === "cloudinary") return false;
  return true;
};

let storage;
if (isValidCloudinaryConfig()) {
  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true,
  });

  try {
    storage = new CloudinaryStorage({
      cloudinary: cloudinary, // Use the configured instance
      params: {
        folder: "doctor_app_profiles",
        allowed_formats: ["jpg", "jpeg", "png"],
        resource_type: "auto", // Automatically detects image type
        // public_id should be a function that returns a string
        public_id: (req, file) => `profile-${Date.now()}-${Math.round(Math.random() * 1e9)}`,
      },
    });
  } catch (err) {
    console.error("Cloudinary Storage Initialization Error:", err);
    storage = multer.diskStorage({
      destination: (req, file, cb) => cb(null, path.join(__dirname, "../uploads")),
      filename: (req, file, cb) => {
        const ext = path.extname(file.originalname) || ".png";
        cb(null, `profile-${Date.now()}${ext}`);
      },
    });
  }
} else {
  const uploadDir = path.join(__dirname, "../uploads");
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  console.warn(
    "Cloudinary is not configured or has an invalid cloud name. Falling back to local disk uploads."
  );

  storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname) || ".png";
      cb(null, `profile-${Date.now()}${ext}`);
    },
  });
}

const upload = multer({ storage });
module.exports = upload;