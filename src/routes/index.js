import { Router } from 'express';
import AccessRouter from './AccessRoute.js';
import ProductRouter from './ProductRoute.js';
// import DiscountRouter from './DiscountRoute.js';

const router = Router();

router.route('/api/v1/')
    .use(AccessRouter)
    .use(ProductRouter)
    // .use(DiscountRouter)

export default router;
