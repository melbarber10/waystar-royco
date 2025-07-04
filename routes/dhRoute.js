import express from "express";
import passport from "passport";
import {
  showLoginForm,
  getDashboard,
  showProfile,
  showEditForm,
  updateDH,
  viewPendingLeaves,
  viewLeaveDetails,
  approveLeave,
  rejectLeave,
  viewLeaveHistory
} from "../controllers/dhController.js";
import { ensureAuthenticated } from "../middlewares/authMiddleware.js";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../public/uploads"));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: function (req, file, cb) {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed!"), false);
    }
  },
});

// Login Routes
router.get("/login", showLoginForm);
router.post("/login", 
  passport.authenticate("dh", {
    successRedirect: "/dh/dashboard",
    failureRedirect: "/dh/login",
    failureFlash: true
  })
);

// Dashboard Route
router.get("/dashboard", ensureAuthenticated, getDashboard);

// Profile Routes
router.get("/profile", ensureAuthenticated, showProfile);
router.get("/profile/edit", ensureAuthenticated, showEditForm);
router.post("/profile", ensureAuthenticated, upload.single("image"), updateDH);

// Leave Management Routes
router.get("/leave/pending", ensureAuthenticated, viewPendingLeaves);
router.get("/leave/history", ensureAuthenticated, viewLeaveHistory);
router.get("/leave/:leaveId", ensureAuthenticated, viewLeaveDetails);
router.post("/leave/approve/:leaveId", ensureAuthenticated, approveLeave);
router.post("/leave/reject/:leaveId", ensureAuthenticated, rejectLeave);

export default router;