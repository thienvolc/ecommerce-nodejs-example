import AuthController from '../controllers/AuthController.js';
import { Router } from 'express';

const router = Router();

router
    .post('/signup', AuthController.signup)
    .post('/login', AuthController.login)
    .post('/refresh-token', AuthController.handleRefreshToken)
    .post('/logout', AuthController.logout);

export default router;
