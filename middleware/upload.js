const multer = require('multer')
const path = require('path')

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'avatars/');
    },
    filename: (req, file, cb) => {
        cb(null,  file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
})

const upload = multer ({
    storage: storage,
    destination: './avatars',
    limit: {
        fileSize: 2 * 512 * 512
    },
    filename: (req, file, cb) => {
        cb(null,  file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    },
    fileFilter (req, file, cb) {
        if (file.mimetype === 'image/png' || file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg') {
            cb(null, true)
        } else (
            cb(null, false)
        )
    }
})


module.exports = upload