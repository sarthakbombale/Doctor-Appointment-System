const multer = require('multer');
const path = require('path');


const storage = multer.diskStorage({
    destination: (res, file, cb) => {
        cb(null, "uploads/")
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname))
    }
})



const fileType = (req, res, cb) => {
    const allowedTypes = ['image/jpg', 'image/jpeg', 'image/png'];
    if (allowedTypes.includes(fileType.mimetype)) {
        cb(null, true)
    } else {
        cb(new Error("file type not valid"), false)
    }
}

const upload= multer({storage,fileType});

module.exports= upload;