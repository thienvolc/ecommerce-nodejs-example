import { CartRepository, ProductBaseRepository } from '../repositories/index.js';
import { NotFoundError } from '../utils/responses/index.js';

export default class CartService {
    static #cartRepository = CartRepository;
    static #productBaseRepository = ProductBaseRepository;

    static createOrUpdateCart = async ({ userId, product }) =>
        await this.#cartRepository.createOrUpdateCart({ userId, product });

    static addToCart = async ({ userId, product }) => {
        const userCart = await this.getUserCart({ userId });
        return userCart
            ? this.updateOrInsertProduct({ userCart, userId, product })
            : this.createOrUpdateCart({ userId, product });
    };

    static getUserCart = async (userId) => await this.#cartRepository.findByUserId(userId);

    static updateOrInsertProduct = async ({ userCart, userId, product }) => {
        return this.isProductExistInCart(userCart, product)
            ? this.updateCartItemQuantity({ userId, product })
            : this.pushProductToCart({ userId, product });
    };

    static isProductExistInCart = (userCart, product) =>
        userCart.cart_products.some((p) => isEqualString(p.productId, product.productId));

    static updateCartItemQuantity = async ({ userId, product }) =>
        await this.#cartRepository.incrementProductQuantity({ userId, product });

    static pushProductToCart = async ({ userId, product }) =>
        await this.#cartRepository.pushProductToCart({ userId, product });

    static validateProductOwnership = async ({ productId, shopId }) => {
        const product = await this.#productBaseRepository.findById(productId);
        if (!product) throw new NotFoundError('Product not found');
        if (!isEqualString(product.product_shopId, shopId)) throw new Error('Product does not belong to this shop');
    };

    static removeFromCart = async ({ userId, productId }) =>
        await this.#cartRepository.removeProductFromCart({ userId, productId });
}

const isEqualString = (a, b) => a.toString() === b.toString();
