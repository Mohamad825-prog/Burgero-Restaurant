// burgero-backend/routes/menu.js
const express = require('express');
const router = express.Router();
const { authMiddleware, adminOnly } = require('../middleware/authMiddleware');
const menuController = require('../controllers/menuController');
const multer = require('multer');
const path = require('path');

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = 'public/uploads/';
        require('fs').mkdirSync(uploadDir, { recursive: true });
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname);
        cb(null, uniqueName);
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|gif|webp/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);
        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Only image files are allowed'));
        }
    }
});

// Public routes
router.get('/items', menuController.getMenuItems);
router.get('/special', menuController.getSpecialItems);

// Protected routes with file upload
router.post('/items',
    authMiddleware,
    adminOnly,
    upload.single('image'),
    menuController.addMenuItem
);

router.post('/special',
    authMiddleware,
    adminOnly,
    upload.single('image'),
    menuController.addSpecialItem
);

// ADD THESE UPDATE ROUTES:
router.put('/items/:id',
    authMiddleware,
    adminOnly,
    upload.single('image'),
    menuController.updateMenuItem
);

router.put('/special/:id',
    authMiddleware,
    adminOnly,
    upload.single('image'),
    menuController.updateSpecialItem
);

router.delete('/items/:id', authMiddleware, adminOnly, menuController.deleteMenuItem);
router.delete('/special/:id', authMiddleware, adminOnly, menuController.deleteSpecialItem);

module.exports = router;