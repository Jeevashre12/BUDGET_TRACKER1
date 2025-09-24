import express from 'express';
import userAuth from '../middleware/userAuth.js';
import { getSalary, upsertSalary } from '../controllers/salaryController.js';

const router = express.Router();

router.get('/', userAuth, getSalary);
router.post('/', userAuth, upsertSalary);

export default router;


