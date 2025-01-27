import AuthController from '../controllers/AuthController.js';
import { validateShopSignup, validateShopLogin } from '../validators/index.js';
import { Router } from 'express';

const router = Router();

router.route('/user')
    .post('/signup', validateShopSignup, AuthController.signup)
    .post('/login', validateShopLogin, AuthController.login)
    .post('/refresh-token', AuthController.handleRefreshToken)
    .post('/logout', AuthController.logout);

export default router;
