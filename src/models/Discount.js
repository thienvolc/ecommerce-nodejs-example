import { model, Schema } from 'mongoose';
import { USER_DOCUMENT_NAME, SHOP_DOCUMENT_NAME, PRODUCT_DOCUMENT_NAME } from './index.js';

const DOCUMENT_NAME = 'Discount';
const COLLECTION_NAME = 'discounts';

const discountSchema = new Schema(
    {
        discount_name: { type: String, required: true },
        discount_desc: { type: String, required: true },
        discount_type: {
            type: String,
            enum: ['fixed_amount', 'percentage'],
            default: 'fixed_amount',
        },
        discount_value: {
            type: Number,
            required: true,
            min: [0, 'Discount value must be positive'],
        },
        discount_max_value: {
            type: Number,
            required: true,
            min: [0, 'Maximum discount value must be positive'],
        },
        discount_min_order_value: {
            type: Number,
            required: true,
            min: [0, 'Minimum order value must be positive'],
        },
        discount_code: {
            type: String,
            required: true,
            unique: true,
            index: true,
        },
        discount_start_date: {
            type: Date,
            required: true,
            validate: {
                validator: function (value) {
                    return value < this.discount_end_date;
                },
                message: 'Start date must be before the end date',
            },
        },
        discount_end_date: { type: Date, required: true },
        discount_max_uses: {
            type: Number,
            required: true,
            min: [1, 'Max uses must be at least 1'],
        },
        discount_uses_count: {
            type: Number,
            default: 0,
            min: [0, 'Uses count cannot be negative'],
        },
        discount_users_used_ids: {
            type: [Schema.Types.ObjectId],
            default: [],
            ref: USER_DOCUMENT_NAME,
        },
        discount_max_uses_per_user: {
            type: Number,
            required: true,
            min: [1, 'Max uses per user must be at least 1'],
        },
        discount_shopId: { type: Schema.Types.ObjectId, ref: SHOP_DOCUMENT_NAME, required: true, index: true },
        discount_is_active: { type: Boolean, default: true },
        discount_applies_to: {
            type: String,
            enum: ['all', 'specific'],
            required: true,
        },
        discount_product_ids: {
            type: [Schema.Types.ObjectId],
            default: [],
            ref: PRODUCT_DOCUMENT_NAME,
            validate: {
                validator: function (value) {
                    return this.discount_applies_to === 'specific' ? value.length > 0 : true;
                },
                message: 'Product IDs must be provided for specific discounts',
            },
        },
    },
    { timestamps: true, collection: COLLECTION_NAME },
);

export default Discount = model(DOCUMENT_NAME, discountSchema);
