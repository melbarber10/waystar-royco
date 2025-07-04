import express from 'express';
import passport from 'passport';
import multer from 'multer';
import { body, validationResult } from 'express-validator';
import { 
    showLoginForm, 
    showRegisterForm, 
    registerUser, 
    logout 
} from '../controllers/authController.js';

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '-' + file.originalname);
    }
});

const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    },
    fileFilter: function (req, file, cb) {
        // Accept images only
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed!'), false);
        }
    }
});

// Show login form
router.get('/login', showLoginForm);

// Handle login
router.post('/login', (req, res, next) => {
    const { role } = req.body;
    
    // Configure passport strategy based on role
    const strategy = role === 'employee' ? 'employee' : 
                    role === 'dh' ? 'dh' : 
                    role === 'coo' ? 'coo' : null;

    if (!strategy) {
        req.flash('error', 'Invalid role selected');
        return res.redirect('/auth/login');
    }

    passport.authenticate(strategy, {
        successRedirect: `/${role}/dashboard`,
        failureRedirect: '/auth/login',
        failureFlash: true
    })(req, res, next);
});

// Show register form
router.get('/register', showRegisterForm);

// Register user with file upload support
router.post('/register', 
    upload.single('image'),
    [
        body('name')
            .trim()
            .isLength({ min: 2, max: 50 })
            .withMessage('Name must be between 2 and 50 characters')
            .matches(/^[a-zA-Z\s]+$/)
            .withMessage('Name can only contain letters and spaces'),
        
        body('email')
            .isEmail()
            .normalizeEmail()
            .withMessage('Please enter a valid email address'),
        
        body('password')
            .isLength({ min: 6 })
            .withMessage('Password must be at least 6 characters long')
            .matches(/\d/)
            .withMessage('Password must contain at least one number'),
        
        body('confirmPassword')
            .custom((value, { req }) => {
                if (value !== req.body.password) {
                    throw new Error('Password confirmation does not match password');
                }
                return true;
            }),
        
        body('phoneNumber')
            .optional()
            .trim(),
        
        body('role')
            .isIn(['employee', 'dh', 'coo'])
            .withMessage('Please select a valid role'),
        
        body('department')
            .isIn(['IT', 'HR', 'Finance', 'Marketing', 'Operations'])
            .withMessage('Please select a valid department')
    ],
    registerUser
);

// Logout
router.get('/logout', logout);

export default router; 