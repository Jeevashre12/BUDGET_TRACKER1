import express from 'express';
import userAuth from '../middleware/userAuth.js';
import { listPlanned, createPlanned, updatePlanned } from '../controllers/plannedController.js';

const router = express.Router();

router.get('/', userAuth, listPlanned);
router.post('/', userAuth, createPlanned);
router.put('/:id', userAuth, updatePlanned);

export default router;
