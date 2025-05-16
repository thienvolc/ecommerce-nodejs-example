import AuthService from './../services/AuthService.js';

import { Headers } from './../utils/authUtils.js';
import { UnauthorizedError } from './../utils/responses/customErrors.js';
import { extractAccessTokenFromHeaders } from '../utils/jwt/index.js';
import { asyncErrorWrapper } from './../helpers/asyncErrorWrapper.js';

class AccessControl {
    static #authService = AuthService;

    static authenticate = async (req, res, next) => {
        const accessToken = this.extractAccessToken(req.headers);
        const userId = this.extractUserId(req.headers);

        const user = await this.#authService.verifyAccessToken(accessToken, userId);

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
            throw new UnauthorizedError('Authorization header is missing or invalid');
        }
    };

    static isValidAuthorizationHeader = (authHeader) => authHeader && authHeader.startsWith('Bearer ');

    static extractUserId = (headers) => {
        const userId = headers[Headers.CLIENT_ID];
        if (!userId) {
            throw new UnauthorizedError('Missing or invalid client ID in the request headers');
        }
        return userId;
    };

    static attachUserToRequest = (req, user) => {
        req.user = user;
    };
}

export default asyncErrorWrapper(AccessControl.authenticate);
