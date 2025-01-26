import { CartRepository } from '../repositories/index.js';
import { NotFoundError } from '../utils/responses/index.js';

export default class CartService {
    static async createUserCart({ userId, product }) {
        const query = { cart_userId: userId, cart_state: 'active' },
            updateOrInsert = { $addtoSet: { cart_products: product } },
            options = { upsert: true, new: true };

        return await CartRepository.findOneAndUpdate(query, updateOrInsert, options);
    }

    static async updateUserCartQuantity({ userId, product }) {
        const { productId, quantity } = product;
        const query = { cart_userId: userId, 'cart_products.productId': productId, cart_state: 'active' },
            updateOrInsert = { $inc: { 'cart_products.$.quantity': quantity } },
            options = { upsert: true, new: true };

        return await CartRepository.findOneAndUpdate(query, updateOrInsert, options);
    }

    static async addToCart({ userId, product = {} }) {
        const userCart = await CartRepository.findOne({ cart_userId: userId }).lean();
        if (!userCart) {
            //
            return await this.createUserCart({ userId, product });
        }

        //
        if (!userCart.cart_products.length) {
            userCart.cart_products = [product];
            return await userCart.save();
        }

        return this.updateUserCartQuantity({ userId, product });
    }

    /*
        {
            shopId,
            item_products: {
                {
                    quantity,
                    price,
                    shopId,
                    old_quantity,
                    productId,
                },
                version
            }
        }
    */

    static async addToCartV2({ userId, product = {} }) {
        const { productId, quantity, old_quantity } = shop_order_ids[0]?.item_products[0];
        const foundProduct = await getProductId(productId);
        if (!foundProduct) throw new NotFoundError('Not found product');
        if (foundProduct.product_shop.toString() !== shop_order_ids[0].shopId);

        if (quantity === 0) {
            this.deleteUserCart({ userId, productId });
        }

        return await CartService.updateUserCartQuantity({
            userId,
            product: { productId, quantity: quantity - old_quantity },
        });
    }

    static async deleteUserCart({ userId, productId }) {
        const query = { cart_userId: userId, cart_state: 'active' },
            updateSet = { $pull: { cart_products: { productId } } };

        const deletedCart = await CartRepository.updateOne(query, updateSet);
        return deletedCart;
    }

    static async getListUserCart({ userId }) {
        return await CartRepository.findOne({ cart_userId: userId }).lean();
    }
}
