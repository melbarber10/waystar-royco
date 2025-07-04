// routes/index.js
import express from 'express';
import { showRegisterForm, registerUser } from '../controllers/authController.js';
// import { ensureAuthenticated } from '../middlewares/authMiddleware.js';


const  router = express.Router();

router.get('/', (req, res) => {
    res.render('shared/home', {
        messages: {
            error: req.flash('error'),
            success: req.flash('success')
        }
    });
});
router.get('/register', showRegisterForm);
router.post('/register', registerUser);

export default router;
