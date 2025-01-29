import { Router } from 'express';
import DiscountController from '../controllers/DiscountController.js';
import authentication from '../middlewares/authentication.js';

const router = Router();

router.get('/shop/:id', DiscountController.getDiscountCodesByShop);

router.use(authentication);

router.route('')
    .post(DiscountController.createDiscountCode)
    .get(DiscountController.getAllDiscountCodes)
    .delete(DiscountController.deleteDiscountCode);

router
    .post('/amount', DiscountController.calculateDiscountAmount)
    .put('/cancel', DiscountController.cancelDiscountCode);

export default router;
