import express from 'express';
import userAuth from '../middleware/userAuth.js';
import { listTransactions, createTransaction } from '../controllers/transactionController.js';

const router = express.Router();

router.get('/', userAuth, listTransactions);
router.post('/', userAuth, createTransaction);

export default router;


