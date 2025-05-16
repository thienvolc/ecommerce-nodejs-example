import jwt from 'jsonwebtoken';
import crypto from 'crypto';

import { UnauthorizedError } from '../responses/index.js';
import { Headers } from './../authUtils.js';

const generateKey = () => Buffer.from(crypto.randomBytes(64)).toString('base64');

export const generateRandomKeyPair = () => ({ privateKey: generateKey(), publicKey: generateKey() });

export const signToken = (payload, key, options) => jwt.sign(payload, key, options);

export const verifyToken = (token, key) => {
    try {
        return jwt.verify(token, key);
    } catch (err) {
        if (err.name === 'TokenExpiredError') throw new jwt.TokenExpiredError('Token expired');

        throw new UnauthorizedError('Invalid token');
    }
};

export const extractRefreshTokenFromHeaders = (headers) => headers[Headers.REFRESH_TOKEN];

export const extractAccessTokenFromHeaders = (authHeader) => authHeader.split(' ')[1];
