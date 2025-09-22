import express from 'express';
import { adminLogin, getUserActivity } from '../controllers/adminController.js';
import { adminAuth } from '../middleware/adminAuth.js';

const router = express.Router();

// public admin login
router.post('/login', adminLogin);

// protected admin route
router.get('/user-activity', adminAuth, getUserActivity);

export default router;
