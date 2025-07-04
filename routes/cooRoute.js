import express from 'express';
import multer from 'multer';
import { ensureAuthenticated } from '../middlewares/authMiddleware.js';
import { 
    getCooDashboard,
    getCooProfile,
    updateCooProfile,
    getPendingLeaves,
    approveLeave,
    denyLeave,
    getLeaveHistory,
    getEmployeeList,
    getEmployeeDetails,
    getDepartmentHeads
} from '../controllers/cooController.js';

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

// Apply authentication middleware to all COO routes
router.use(ensureAuthenticated);

// Dashboard and Profile routes
router.get('/dashboard', getCooDashboard);
router.get('/profile', getCooProfile);
router.post('/profile/update', upload.single('image'), updateCooProfile);

// Leave management routes
router.get('/leave/pending', getPendingLeaves);
router.post('/leave/:id/approve', approveLeave);
router.post('/leave/:id/deny', denyLeave);
router.get('/leave/history', getLeaveHistory);

// Employee management routes
router.get('/employees', getEmployeeList);
router.get('/employees/:id', getEmployeeDetails);

// Department Heads route
router.get('/department-heads', getDepartmentHeads);

export default router; 