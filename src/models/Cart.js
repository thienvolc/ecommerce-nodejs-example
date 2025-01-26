import { model, Schema } from 'mongoose';
import { productSchema } from './Product.js';

const DOCUMENT_NAME = 'Cart';
const COLLECTION_NAME = 'carts';

const cartSchema = new Schema(
    {
        cart_state: {
            type: String,
            required: true,
            enum: ['active', 'completed', 'failed', 'pending'],
            default: 'active',
        },
        cart_products: {
            type: [productSchema],
            default: [],
            validate: {
                validator: function (products) {
                    return Array.isArray(products) && products.length > 0;
                },
                message: 'Cart must contain at least one product',
            },
        },
        cart_count_product: {
            type: Number,
            default: 0,
            validate: {
                validator: function (count) {
                    return count === this.cart_products.length;
                },
                message: 'Product count does not match the number of items in the cart',
            },
        },
        cart_userId: { type: Schema.Types.ObjectId, required: true, ref: 'User', index: true },
    },
    { collection: COLLECTION_NAME, timestamps: true },
);

export default model(DOCUMENT_NAME, cartSchema);
