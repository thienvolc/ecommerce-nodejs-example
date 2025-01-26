import { Router } from 'express';
import AccessRouter from './AccessRoute.js';

const router = Router();

router.use('/api/v1/shop', AccessRouter);

export default router;
