import express from 'express';
import userAuth from '../middleware/userAuth.js';
import { getMonthlySummary } from '../controllers/summaryController.js';

const router = express.Router();

router.get('/monthly', userAuth, getMonthlySummary);

export default router;
