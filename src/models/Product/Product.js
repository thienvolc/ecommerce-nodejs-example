import { model, Schema } from 'mongoose';
import { createProductSlugFromName } from '../../utils/mongooseUtils.js';
import { CLOTHING_DOCUMENT_NAME, ELECTRONICS_DOCUMENT_NAME, FURNITURE_DOCUMENT_NAME } from './index.js';
import { SHOP_DOCUMENT_NAME } from '../index.js';

const COLLECTION_NAME = 'products';
const DOCUMENT_NAME = 'Product';
const ProductType = {
    Clothing: CLOTHING_DOCUMENT_NAME,
    Electronics: ELECTRONICS_DOCUMENT_NAME,
    Furniture: FURNITURE_DOCUMENT_NAME,
};

const productSchema = new Schema(
    {
        product_shopId: { type: Schema.Types.ObjectId, ref: SHOP_DOCUMENT_NAME },
        isDraft: { type: Boolean, default: true, index: true, select: false },
        isPublished: { type: Boolean, default: false, index: true, select: false },
        product_type: { type: String, required: true, enum: Object.values(ProductType) },
        product_price: { type: Number, required: true, min: [0, 'Price must be positive'] },
        product_quantity: { type: Number, required: true, min: [0, 'Quantity must be positive'] },
        product_attributes: { type: Schema.Types.Mixed, required: true },

        product_name: { type: String, required: true },
        product_slug: { type: String, unique: true },
        product_thumb: { type: String, required: true },
        product_desc: { type: String },
        product_rating: {
            type: Number,
            default: 4.5,
            min: [1, 'Rating must be above 1.0'],
            max: [5, 'Rating must be below 5.0'],
            set: (val) => Math.floor(val * 10) / 10,
        },
        product_variations: {
            type: new Schema(
                {
                    color: String,
                    size: String,
                    price: Number,
                },
                { _id: false },
            ),
            default: [],
        },
    },
    { timestamps: true, collection: COLLECTION_NAME },
);

productSchema.index({ product_name: 'text', product_desc: 'text' });
productSchema.index({ product_type: 1, product_shopId: 1 });
productSchema.pre('save', function (next) {
    if (this.isModified('product_name')) {
        this.product_slug = createProductSlugFromName(this.product_name);
    }
    next();
});

export default Product = model(DOCUMENT_NAME, productSchema);
export { DOCUMENT_NAME as PRODUCT_DOCUMENT_NAME, ProductType };
