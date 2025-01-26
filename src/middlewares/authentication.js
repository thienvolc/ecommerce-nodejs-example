import { Headers } from './../utils/authUtils.js';
import { extractAccessTokenFromHeaders } from '../utils/jwt/index.js';
import { asyncErrorWrapper } from './../helpers/asyncErrorWrapper.js';
import AuthService from './../services/AuthService.js';

class AccessControl {
    static authenticate = async (req, res, next) => {
        const accessToken = this.extractAccessToken(req.headers);
        const userId = this.extractUserId(req.headers);

        const user = await AuthService.verifyAccessToken(accessToken, userId);

        this.attachUserToRequest(req, user);
        return next();
    };

    static extractAccessToken = (headers) => {
        const authHeader = headers[Headers.AUTHORIZATION];
        this.checkAuthorizationHeader(authHeader);
        return extractAccessTokenFromHeaders(authHeader);
    };

    static checkAuthorizationHeader = (authHeader) => {
        if (!this.isValidAuthorizationHeader(authHeader)) {
            throw new AuthFailureError('Authorization header is missing or invalid');
        }
    };

    static isValidAuthorizationHeader = (authHeader) => authHeader && authHeader.startsWith('Bearer ');

    static extractUserId = (headers) => {
        const userId = headers[Headers.CLIENT_ID];
        if (!userId) {
            throw new AuthFailureError('Missing or invalid client ID in the request headers');
        }
        return userId;
    };

    static attachUserToRequest = (req, user) => {
        req.user = user;
    };
}

export default authentication = asyncErrorWrapper(AccessControl.authenticate);
