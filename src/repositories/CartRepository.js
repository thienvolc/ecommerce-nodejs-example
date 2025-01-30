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

    static createOrUpdateCart = async ({ userId, product }) => {
        return await CartRepository.findOneAndUpdate(
            { cart_userId: userId, cart_state: 'active' },
            {
                $setOnInsert: { cart_userId, cart_state: 'active', cart_products: [product] },
                $addToSet: { cart_products: product },
            },
            { upsert: true, new: true },
        );
    };

    static incrementProductQuantity = async ({ userId, product }) => {
        return await CartRepository.findOneAndUpdate(
            { cart_userId: userId, 'cart_products._id': product._id, cart_state: 'active' },
            { $inc: { 'cart_products.$.product_quantity': product.product_quantity } },
            { new: true },
        );
    };

    static pushProductToCart = async ({ userId, product }) => {
        return await CartRepository.findOneAndUpdate(
            { cart_userId: userId, cart_state: 'active' },
            { $push: { cart_products: product } },
            { new: true },
        );
    };

    static removeProductFromCart = async ({ userId, productId }) => {
        return await CartRepository.updateOne(
            { cart_userId: userId, cart_state: 'active' },
            { $pull: { cart_products: { productId } } },
        );
    };
}
