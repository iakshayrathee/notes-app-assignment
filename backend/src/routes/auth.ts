import express from 'express';
import { signup, verifyOTP, googleAuth, signin, verifySigninOTP } from '../controllers/authController';

const router = express.Router();

router.post('/signup', signup);
router.post('/verify-otp', verifyOTP);
router.post('/google', googleAuth);
router.post('/signin', signin);
router.post('/verify-signin-otp', verifySigninOTP);

export default router;
