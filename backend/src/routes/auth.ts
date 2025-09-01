import express from 'express';
import { signup, googleAuth, signin } from '../controllers/authController';

const router = express.Router();

router.post('/signup', signup);
router.post('/google', googleAuth);
router.post('/signin', signin);

export default router;
