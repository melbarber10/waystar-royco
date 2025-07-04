import express from 'express';
import path from 'path';
import session from 'express-session';
import flash from 'connect-flash';
import passport from 'passport';
import dotenv from 'dotenv';
import methodOverride from 'method-override';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import connectDb from './config/database.js';
import './config/passport.js';  

// Load env vars
dotenv.config();

// Initialize app
const app = express();

// Convert the module URL to a file path
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Connect to database
connectDb();



// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

// Set view engine
app.set('view engine', 'ejs');

// Method override
app.use(methodOverride('_method'));

// Session middleware
app.use(session({
    secret: process.env.SESSION_SECRET || 'secret',
    resave: false,
    saveUninitialized: false
}));

// Flash middleware
app.use(flash());

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Global variables
app.use((req, res, next) => {
    res.locals.user = req.user || null;
    res.locals.error = req.flash('error');
    res.locals.success = req.flash('success');
    next();
});

// Routes
import indexRoutes from './routes/index.js';
import employeeRoutes from './routes/employeeRoute.js';
import dhRoutes from './routes/dhRoute.js';
import cooRoutes from './routes/cooRoute.js';
import authRoutes from './routes/authRoute.js';

app.use('/', indexRoutes);
app.use('/employee', employeeRoutes);
app.use('/dh', dhRoutes);
app.use('/coo', cooRoutes);
app.use('/auth', authRoutes);

// Error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).render('error', { message: 'Something went wrong!' });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});