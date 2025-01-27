import { Router } from 'express';
import DiscountController from '../controllers/DiscountController.js';
import authentication from '../middlewares/authentication.js';

const router = Router();

router.route('/discount')
    .get('/shop/:id', DiscountController.getDiscountCodesByShop)

router.route('/discount')
    .all(authentication)
    .post(DiscountController.createDiscountCode)
    .get(DiscountController.getAllDiscountCodes)
    .post('/amount', DiscountController.calculateDiscountAmount)
    .put('/cancel', DiscountController.cancelDiscountCode)
    .delete(DiscountController.deleteDiscountCode);

export default router;
