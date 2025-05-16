import UserService from './UserService.js';
import RefreshTokenKeyService from './RefreshTokenKeyService.js';

import { selectFieldsFromObject } from '../utils/objectUtils.js';

class AuthResponse {
    static build(user, tokenPair) {
        return {
            user: this.extractUserInfo(user),
            tokens: tokenPair,
        };
    }

    static extractUserInfo(user) {
        return selectFieldsFromObject(user, ['_id', 'name', 'email']);
    }
}

export default class AuthService {
    static #userService = UserService;
    static #refreshTokenKeyService = RefreshTokenKeyService;

    static signup = async ({ name, email, password }) => {
        const user = await this.#userService.createUserWithHashPassword({ name, email, password });
        const tokenPair = await this.#refreshTokenKeyService.createTokenPairForUser(user);
        return AuthResponse.build(user, tokenPair);
    };

    static login = async ({ email, password }) => {
        const user = await this.#userService.authenticateCredentials(email, password);
        const tokenPair = await this.#refreshTokenKeyService.refreshTokenPairForUser(user);
        return AuthResponse.build(user, tokenPair);
    };

    static loginWithRefreshTokenTracking = async ({ email, password }, refreshToken) => {
        const authResponse = await this.login({ email, password });
        await this.#trackRefreshTokenUsage(authResponse.user._id, refreshToken);
        return authResponse;
    };

    static #trackRefreshTokenUsage = async (userId, refreshToken) => {
        await this.#refreshTokenKeyService.recordUsedRefreshTokenForUser(userId, refreshToken);
    };

    static handleRefreshToken = async (userId, refreshToken) => {
        const user = await this.#fetchUserAndVerifyRefreshToken(userId, refreshToken);
        const tokenPair = await this.#refreshTokenKeyService.refreshTokenPairForUser(user);
        await this.#trackRefreshTokenUsage(user._id, refreshToken);
        return AuthResponse.build(user, tokenPair);
    };

    static #fetchUserAndVerifyRefreshToken = async (userId, refreshToken) => {
        const [user] = await Promise.all([
            this.#userService.requireUserById(userId),
            this.#refreshTokenKeyService.verifyUserRefreshToken(refreshToken, userId),
        ]);
        return user;
    };

    static logoutAllUsersWithRefreshTokenTracking = async (userId, refreshToken) => {
        await this.logoutAllUsers(userId);
        await this.#trackRefreshTokenUsage(userId, refreshToken);
    };

    static logoutAllUsers = async (userId) => {
        await this.#refreshTokenKeyService.invalidateTokenKeyOfUser(userId);
        const user = await this.#userService.requireUserById(userId);
        await this.#refreshTokenKeyService.refreshTokenPairForUser(user);
    };

    static verifyAccessToken = async (accessToken, userId) => {
        const user = await this.#userService.requireUserById(userId);
        await this.#refreshTokenKeyService.verifyAccessToken(accessToken, userId);
        return user;
    };
}
