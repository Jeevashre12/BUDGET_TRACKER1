import express from 'express';
import userAuth from '../middleware/userAuth.js';
import {
  listTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  listCategories,
  recentTransactions,
} from '../controllers/transactionController.js';

const router = express.Router();

router.get('/', userAuth, listTransactions);
router.get('/recent', userAuth, recentTransactions);
router.get('/categories', userAuth, listCategories);
router.post('/', userAuth, createTransaction);
router.put('/:id', userAuth, updateTransaction);
router.delete('/:id', userAuth, deleteTransaction);

export default router;
