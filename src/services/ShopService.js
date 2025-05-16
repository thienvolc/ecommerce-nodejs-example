import { ShopRepository } from '../repositories/index.js';

export default class ShopService {
    static #shopRepository = ShopRepository;

    static createShop = async (shop) => await this.#shopRepository.create(shop);

    static findByEmail = async (email) => await this.#shopRepository.findByEmail(email);

    static getAllShops = async ({ name }) => await this.#shopRepository.findByName(name);

    static getShopById = async (id) => await this.#shopRepository.findById(id);

    static getShopByOwnerId = async (ownerId) => await this.#shopRepository.getShopByOwnerId(ownerId);
}
