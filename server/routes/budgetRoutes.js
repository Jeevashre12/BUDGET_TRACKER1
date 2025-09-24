import express from 'express';
import userAuth from '../middleware/userAuth.js';
import { listBudgets, upsertBudget, deleteBudget } from '../controllers/budgetController.js';

const router = express.Router();

router.get('/', userAuth, listBudgets);
router.post('/', userAuth, upsertBudget);
router.delete('/', userAuth, deleteBudget);

export default router;


