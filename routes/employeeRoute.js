import express from "express";
const router = express.Router();
import passport from "passport";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../public/uploads'))
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname))
    }
});

const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    },
    fileFilter: function (req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('Only image files are allowed!'), false);
        }
        cb(null, true);
    }
});

import {
  showLoginForm,
  employeeHome,
  showProfile,
  showEditForm,
  updateEmployee,
  showApplyForm,
  applyLeave,
  showTrack,
  getDashboard
} from "../controllers/employeeController.js";
import { ensureAuthenticated } from "../middlewares/authMiddleware.js";

// ===== Login Routes =====
router.get("/login", showLoginForm);
router.post(
  "/login",
  passport.authenticate("employee", {
    successRedirect: "/employee/dashboard",
    failureRedirect: "/employee/login",
    failureFlash: true,
  })
);

// ===== Dashboard =====
router.get("/dashboard", ensureAuthenticated, getDashboard);

// ===== Home Page =====
router.get("/home", ensureAuthenticated, employeeHome);

// ===== Profile Routes =====
router.get("/profile", ensureAuthenticated, showProfile);
router.get("/profile/edit", ensureAuthenticated, showEditForm);
router.post("/profile", ensureAuthenticated, upload.single('image'), updateEmployee);

// ===== Leave Application =====
router.get("/leave/apply", ensureAuthenticated, showApplyForm);
router.post("/leave/apply", ensureAuthenticated, applyLeave);

// ===== Leave Tracking =====
router.get("/leave/track", ensureAuthenticated, showTrack);

export default router;