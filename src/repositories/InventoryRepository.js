import { Inventory } from '../models/index.js';

export default class InventoryRepository {
    static async create({ productId, shopId, stock, location = 'unknown' }) {
        return await Inventory.create({
            inven_productId: productId,
            inven_shopId: shopId,
            inven_stock: stock,
            inven_location: location,
        });
    }

    static async findById(inventoryId, projection = '') {
        const id = castMongooseObjectId(inventoryId);
        return await Inventory.findById(id).select(projection).lean();
    }

    static async findByProductIdAndShopId(productId, shopId, projection = '') {
        return await Inventory
            .findOne({
                inven_productId: castMongooseObjectId(productId),
                inven_shopId: castMongooseObjectId(shopId),
            })
            .select(projection)
            .lean();
    }

    static async findByShopId(shopId, projection = '') {
        return await Inventory
            .find({ inven_shopId: castMongooseObjectId(shopId) })
            .select(projection)
            .lean();
    }
}
