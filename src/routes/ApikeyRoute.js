import { Router } from 'express';
import ApikeyController from '../controllers/ApikeyController.js';

const router = Router();

router
    .post('/generate', ApikeyController.createReadWriteKey);

export default router;
