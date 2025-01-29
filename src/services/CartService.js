import { CartRepository, ProductRepository } from '../repositories/index.js';
import { NotFoundError } from '../utils/responses/index.js';

export default class CartService {
    static createOrUpdateCart = async ({ userId, product }) => {
        return await CartRepository.findOneAndUpdate(
            { cart_userId: userId, cart_state: 'active' },
            { $setOnInsert: { cart_userId, cart_state: 'active', cart_products: [product] } },
            { upsert: true, new: true },
        );
    };

    static addToCart = async ({ userId, product }) => {
        const userCart = await this.getUserCart({ userId });
        return userCart
            ? this.updateOrInsertProduct({ userCart, userId, product })
            : this.createOrUpdateCart({ userId, product });
    };

    static updateOrInsertProduct = async ({ userCart, userId, product }) => {
        return this.isProductExistInCart(userCart, product)
            ? this.updateCartItemQuantity({ userId, product })
            : this.pushProductToCart({ userId, product });
    };

    static isProductExistInCart(userCart, product) {
        return userCart.cart_products.some((p) => p.productId === product.productId);
    }

    static updateCartItemQuantity = async ({ userId, product }) => {
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

    static validateProductOwnership = async ({ productId, shopId }) => {
        const product = await ProductRepository.findById(productId);
        if (!product) throw new NotFoundError('Product not found');
        if (product.product_shopId.toString() !== shopId) throw new Error('Product does not belong to this shop');
    };

    static removeFromCart = async ({ userId, productId }) => {
        return await CartRepository.updateOne(
            { cart_userId: userId, cart_state: 'active' },
            { $pull: { cart_products: { productId } } },
        );
    };

    static getUserCart = async (userId) => {
        return await CartRepository.findByUserId(userId);
    };
}
