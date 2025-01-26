import { ShopRepository } from '../repositories/index.js';
import { comparePassword, hashPassword } from '../utils/authUtils.js';
import { InternalServerError, BadRequestError, AuthFailureError } from '../utils/responses/index.js';

export default class ShopService {
    static createShopWithHashPassword = async ({ name, email, password }) => {
        await this.ensureEmailNotExist(email);
        const hashedPassword = await hashPassword(password);
        return this.createShop({ name, email, password: hashedPassword });
    };

    static createShop = async ({ name, email, password }) => {
        try {
            return await ShopRepository.create({ name, email, password });
        } catch (error) {
            throw new InternalServerError('Failed to create shop');
        }
    };

    static ensureEmailNotExist = async (email) => {
        const isExist = await this.#isEmailExisting(email);
        if (isExist) {
            throw new BadRequestError('Email already exists');
        }
    };

    static #isEmailExisting = async (email) => {
        const shop = await ShopRepository.findByEmail(email);
        return !!shop;
    };

    static authenticateCredentials = async (email, password) => {
        const shop = await this.#requireShopByEmail(email);
        const isValidPassword = await this.#comparePassword(password, shop.password);
        if (!isValidPassword) {
            throw new AuthFailureError('Invalid password');
        }
        return shop;
    };

    static #requireShopByEmail = async (email) => {
        const shop = await ShopRepository.findByEmail(email);
        if (!shop) {
            throw new BadRequestError('No shop found with the provided email');
        }
        return shop;
    };

    static #comparePassword = async (password, hashedPassword) => {
        return await comparePassword(password, hashedPassword);
    };

    static requireShopById = async (shopId) => {
        const shop = await ShopRepository.findById(shopId);
        if (!shop) {
            throw new AuthFailureError('Shop does not exist');
        }
        return shop;
    };
}
