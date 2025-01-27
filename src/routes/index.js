import { Router } from 'express';
import AccessRouter from './AccessRoute.js';
import DiscountRouter from './DiscountRoute.js';
import ProductRouter from './ProductRoute.js';

const router = Router();

router.route('/api/v1/')
    .use(AccessRouter)
    .use(DiscountRouter)
    .use(ProductRouter);

export default router;
