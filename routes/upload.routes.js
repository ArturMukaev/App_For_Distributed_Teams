const multer = require('multer');
const fs = require('fs');
const auth = require('../middleware/auth.middleware');
const {Router} = require('express');
const path = require('path')

const router = Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const {userId} = req.user;
        req.filepath = `/${userId}`;
        const userUploadsDir = path.join(process.cwd(), `/uploads/${userId}`);

        if (!fs.existsSync(userUploadsDir)) {
            fs.mkdirSync(userUploadsDir, { recursive: true });
        }

        cb(null, userUploadsDir);
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    const allowedMimeTypes = ['image/jpeg','image/jpg', 'image/png', 'image/svg'];

    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        req.fileValidationError = 'Формат файла аватара не поддерживается';
        cb(null, false);
    }
};

const upload = multer({ storage: storage, fileFilter: fileFilter });

router.post('/image', auth, upload.single('image'), (req, res) => {
    try {
        if (req.fileValidationError) {
            return res.status(400).json({ message: req.fileValidationError });
        }
        const imageUrl = `${req.protocol}://${req.get('host')}${req.filepath}/${req.file.filename}`;
        res.json({ imageUrl, message: 'Файл загружен' });
    } catch (e) {
        res.status(500).json({message: 'Что то пошло не так!'})
    }

});

module.exports = router