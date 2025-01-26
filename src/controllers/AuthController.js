import AuthService from '../services/AuthService.js';
import { ResponseSender, CREATED, OK } from '../utils/responses/index.js';
import { getRefreshTokenFromHeaders } from '../utils/jwt/index.js';
import { asyncErrorDecorator } from '../helpers/asyncErrorWrapper.js';

class AuthController {
    static signup = async (req, res, next) => {
        const response = new CREATED({
            message: 'Shop created successfully',
            metadata: await AuthService.signup(req.body),
        });
        ResponseSender.send(res, response);
    };

    static login = async (req, res, next) => {
        const refreshToken = getRefreshTokenFromHeaders(req.headers);
        const metadata = refreshToken
            ? await AuthService.loginWithRefreshTokenTracking(req.body, refreshToken)
            : await AuthService.login(req.body);
        const response = new OK({ message: 'Shop logged in successfully', metadata });
        ResponseSender.send(res, response);
    };

    static handleRefreshToken = async (req, res, next) => {
        const refreshToken = getRefreshTokenFromHeaders(req.headers);
        const response = new OK({
            message: 'Token refreshed successfully',
            metadata: await AuthService.handleRefreshToken(req.body.shopId, refreshToken),
        });
        ResponseSender.send(res, response);
    };

    static logout = async (req, res, next) => {
        const refreshToken = getRefreshTokenFromHeaders(req.headers);
        refreshToken
            ? await AuthService.logoutAllShopsWithRefreshTokenTracking(req.body.shopId, refreshToken)
            : await AuthService.logoutAllShops(req.body.shopId);
        const response = new OK({ message: 'All shops logged out successfully' });
        ResponseSender.send(res, response);
    };
}

const authController = asyncErrorDecorator.decorateAllStaticMethods(AuthController);

export default authController;
