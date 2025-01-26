import AuthController from '../controllers/AuthController.js';
import { validateShopSignup, validateShopLogin } from '../validators/index.js';
import { Router } from 'express';

const router = Router();

// Start with api/v1/shop/
router.post('/signup', validateShopSignup, AuthController.signup);
router.post('/login', validateShopLogin, AuthController.login);
router.post('/logout', AuthController.logout);
router.post('/refresh-token', AuthController.handleRefreshToken);

export default router;
