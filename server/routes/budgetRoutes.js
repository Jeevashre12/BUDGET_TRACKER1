import express from 'express';
import userAuth from '../middleware/userAuth.js';
import { getBudgets, setBudget } from '../controllers/budgetController.js';

const router = express.Router();

router.get('/', userAuth, getBudgets);
router.post('/', userAuth, setBudget);

export default router;
