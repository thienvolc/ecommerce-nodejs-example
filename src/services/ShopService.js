import { ShopRepository } from '../repositories/index.js';

export default class ShopService {
    static createShop = async (shop) => {
        return await ShopRepository.create(shop);
    };

    static findByEmail = async (email) => {
        return await ShopRepository.findByEmail(email);
    };

    static getAllShops = async ({ name }) => {
        return await ShopRepository.findByName(name);
    };

    static getShopById = async (id) => {
        return await ShopRepository.findById(id);
    };

    static getShopByOwnerId = async (ownerId) => {
        return await ShopRepository.getShopByOwnerId(ownerId);
    };
}
