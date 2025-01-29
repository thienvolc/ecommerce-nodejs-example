import { Router } from 'express';
import CartController from '../controllers/CartController.js';
import authentication from '../middlewares/authentication.js';

const router = Router();

router.use(authentication);

router.route('/')
    .post(CartController.createUserCart)
    .get(CartController.getUserCartList)
    .patch(CartController.updateUserCartQuantity)
    .delete(CartController.deleteUserCart);

export default router;
