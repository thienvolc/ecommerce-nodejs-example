import { RefreshTokenKeyRepository } from '../repositories/index.js';
import { generateRandomKeyPair, signToken, verifyToken } from '../utils/jwt/index.js';
import { UnauthorizedError, ForbiddenError } from '../utils/responses/index.js';
import { selectFieldsFromObject } from '../utils/objectUtils.js';
import { ACCESS_TOKEN_EXPIRY, REFRESH_TOKEN_EXPIRY } from '../config/jwt/index.js';

export default class RefreshTokenKeyService {
    static #refreshTokenKeyRepository = RefreshTokenKeyRepository;

    static createTokenPairForUser = async (user) => {
        const payload = this.#createTokenPayload(user);
        const keyPair = this.#generateRandomKeyPair();
        const tokenPair = this.#generateTokenPairFromKeyPair(payload, keyPair);
        await this.#storeTokenkeyForUser(user._id, tokenPair.refreshToken, keyPair);
        return tokenPair;
    };

    static #createTokenPayload = (user) => selectFieldsFromObject(user, ['_id', 'email']);

    static #generateRandomKeyPair = () => generateRandomKeyPair();

    static #generateTokenPairFromKeyPair = (payload, keyPair) => {
        const { privateKey, publicKey } = keyPair;
        const refreshToken = this.#signToken(payload, privateKey, { expiresIn: REFRESH_TOKEN_EXPIRY });
        const accessToken = this.#signToken(payload, publicKey, { expiresIn: ACCESS_TOKEN_EXPIRY });
        return { accessToken, refreshToken };
    };

    static #signToken = (payload, key, options) => {
        if (!payload._id) throw new Error("Missing required field '_id' in payload.");
        return signToken(payload, key, options);
    };

    static #storeTokenkeyForUser = async (userId, refreshToken, keyPair) => {
        await this.#refreshTokenKeyRepository.create({ userId, ...keyPair, refreshToken });
    };

    static verifyUserRefreshToken = async (refreshToken, userId) => {
        const tokenKey = await this.#getTokenKeyByUserId(userId);
        await this.#verifyRefreshTokenIntegrity(refreshToken, tokenKey);
    };

    static #getTokenKeyByUserId = async (userId) => {
        const tokenKey = await this.#refreshTokenKeyRepository.findByUserId(userId);
        if (!tokenKey) throw new UnauthorizedError('User does not exist');

        return tokenKey;
    };

    static #verifyRefreshTokenIntegrity = async (refreshToken, tokenKey) => {
        if (tokenKey.refreshToken === refreshToken)
            return this.#verifyTokenAndExtractPayload(refreshToken, tokenKey.privateKey);

        await this.#handleReusedRefreshToken(tokenKey, refreshToken);
        throw new UnauthorizedError('Invalid refresh token');
    };

    static #verifyTokenAndExtractPayload = (token, key) => verifyToken(token, key);
    static #handleReusedRefreshToken = async (tokenKey, refreshToken) => {
        if (this.isRefreshTokenUsed(refreshToken, tokenKey)) {
            await this.#revokeReusedRefreshToken(tokenKey.userId, refreshToken);
            throw new ForbiddenError('Refresh token has been reused. Please log in again!');
        }
    };
    static isRefreshTokenUsed = (refreshToken, tokenKey) => tokenKey.usedRefreshTokens.includes(refreshToken);

    static #revokeReusedRefreshToken = async (userId, refreshToken) => {
        await this.invalidateTokenKeyOfUser(userId);
        await this.recordUsedRefreshTokenForUser(userId, refreshToken);
    };

    static recordUsedRefreshTokenForUser = async (userId, usedRefreshToken) => {
        const update = { $addToSet: { usedRefreshTokens: usedRefreshToken } };
        await this.#refreshTokenKeyRepository.findByUserIdAndUpdate(userId, update);
    };

    static invalidateTokenKeyOfUser = async (userId) => {
        const keyPair = this.#generateRandomKeyPair();
        const update = { $set: { ...keyPair, refreshToken: null } };
        await this.#refreshTokenKeyRepository.findByUserIdAndUpdate(userId, update);
    };

    static refreshTokenPairForUser = async (user) => {
        const payload = this.#createTokenPayload(user);
        const keyPair = await this.getKeyPairByUserId(user._id);
        const tokenPair = this.#generateTokenPairFromKeyPair(payload, keyPair);
        await this.#updateActiveRefreshTokenByUserId(user._id, tokenPair.refreshToken);
        return tokenPair;
    };

    static getKeyPairByUserId = async (userId) => {
        const tokenKey = await this.#refreshTokenKeyRepository.findByUserId(userId);
        return this.#extractKeyPair(tokenKey);
    };

    static #extractKeyPair = (tokenKey) => {
        const { privateKey, publicKey } = tokenKey;
        return { privateKey, publicKey };
    };

    static #updateActiveRefreshTokenByUserId = async (userId, refreshToken) => {
        const update = { $set: { refreshToken } };
        await this.#refreshTokenKeyRepository.findByUserIdAndUpdate(userId, update);
    };

    static verifyAccessToken = async (accessToken, userId) => {
        const keyPair = await this.getKeyPairByUserId(userId);
        return this.#verifyTokenAndExtractPayload(accessToken, keyPair.publicKey);
    };
}
