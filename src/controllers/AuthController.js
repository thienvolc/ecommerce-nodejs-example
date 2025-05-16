import AuthService from '../services/AuthService.js';
import { ResponseSender, CREATED, OK } from '../utils/responses/index.js';
import { extractRefreshTokenFromHeaders } from '../utils/jwt/index.js';
import { asyncErrorDecorator } from '../helpers/asyncErrorWrapper.js';

class AuthController {
    // [POST] /user/signup
    static signup = async (req, res, next) => {
        const authResponse = await AuthService.signup(req.body);
        try {
        const response = new CREATED({ message: 'User created successfully', metadata: authResponse });
            ResponseSender.send(res, response);
        } catch (error) {
            console.log(error);
        }
    };

    // [POST] /user/login
    static login = async (req, res, next) => {
        const refreshToken = extractRefreshTokenFromHeaders(req.headers);
        const authResponse = refreshToken
            ? await AuthService.loginWithRefreshTokenTracking(req.body, refreshToken)
            : await AuthService.login(req.body);

        const response = new OK({ message: 'User logged in successfully', metadata: authResponse });
        ResponseSender.send(res, response);
    };

    // [POST] /user/refresh-token
    static handleRefreshToken = async (req, res, next) => {
        const refreshToken = extractRefreshTokenFromHeaders(req.headers);
        const authResponse = await AuthService.handleRefreshToken(req.body.userId, refreshToken);

        const response = new OK({ message: 'Token refreshed successfully', metadata: authResponse });
        ResponseSender.send(res, response);
    };

    // [POST] /user/logout
    static logout = async (req, res, next) => {
        const refreshToken = extractRefreshTokenFromHeaders(req.headers);
        refreshToken
            ? await AuthService.logoutAllUsersWithRefreshTokenTracking(req.body.userId, refreshToken)
            : await AuthService.logoutAllUsers(req.body.userId);

        const response = new OK({ message: 'All users logged out successfully' });
        ResponseSender.send(res, response);
    };
}

export default asyncErrorDecorator.decorateAllStaticMethods(AuthController);
