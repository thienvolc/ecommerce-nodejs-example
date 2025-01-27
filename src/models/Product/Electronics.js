import { Schema, model } from 'mongoose';
import { SHOP_DOCUMENT_NAME } from '../index.js';

const COLLECTION_NAME = 'electronics';
const DOCUMENT_NAME = 'Electronics';

const electronicsSchema = new Schema(
    {
        product_shopId: { type: Schema.Types.ObjectId, ref: SHOP_DOCUMENT_NAME },
        manufacturer: { type: String, require: true },
        model: String,
        color: String,
    },
    { collection: COLLECTION_NAME, timestamps: true },
);

export default Electronics = model(DOCUMENT_NAME, electronicsSchema);
export { DOCUMENT_NAME as ELECTRONICS_DOCUMENT_NAME };
