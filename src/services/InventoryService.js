import { InventoryRepository } from '../repositories/index.js';

export default class InventoryService {
    static addStockToInventory = async (stock) => {
        return await InventoryRepository.create(stock);
    };
}
