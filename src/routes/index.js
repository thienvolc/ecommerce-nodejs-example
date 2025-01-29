import { Router } from 'express';
import AccessRouter from './AccessRoute.js';
import ProductRouter from './ProductRoute.js';
import ApikeyRouter from './ApikeyRoute.js';
import { apikey, permission } from '../middlewares/apiKeyValidator.js';
// import DiscountRouter from './DiscountRoute.js';

const router = Router();

router
    .use(apikey)
    .use(permission('1111'))
    .use('/api/v1/user', AccessRouter)
    .use('/api/v1/product', ProductRouter)
    .use('/api/v1/apikey', ApikeyRouter)
    // .use('/api/v1//discount', DiscountRouter);

export default router;
