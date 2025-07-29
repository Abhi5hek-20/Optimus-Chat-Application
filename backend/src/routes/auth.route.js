import express from 'express';
import { login,logout, signup } from '../controllers/auth.controller.js';  // import login controller
import { protectedRoute } from '../middleware/auth.middleware.js'; // import protectedRoute middleware

const router = express.Router();

router.post("/login",login);

router.post("/signup",signup);

router.post("/logout", logout);


// checks if user is logged in or not
router.get("/me", protectedRoute, (req, res) => {
    res.status(200).json({
        success: true,
        user: req.user
    });
});

export default router;