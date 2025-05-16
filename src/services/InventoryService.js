import { InventoryRepository } from '../repositories/index.js';

export default class InventoryService {
    static #inventoryRepository = InventoryRepository;

    static addStockToInventory = async (stock) => {
        return await this.#inventoryRepository.create(stock);
    };
}
