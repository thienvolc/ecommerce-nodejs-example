import { Cart } from '../models/index.js';
export default class CartRepository {
    static findOneAndUpdate = async (query, updateOrInsert, options) => {
        return Cart.findOneAndUpdate(query, updateOrInsert, options).lean();
    };

    static findByUserId = async (cart_userId) => {
        return Cart.findOne({ cart_userId }).lean();
    };

    static updateOne = async (query, update) => {
        return Cart.updateOne(query, update);
    };
}
