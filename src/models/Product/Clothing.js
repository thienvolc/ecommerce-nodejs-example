import { Schema, model } from 'mongoose';
import { SHOP_DOCUMENT_NAME } from '../index.js';

const COLLECTION_NAME = 'clothings';
const DOCUMENT_NAME = 'Clothing';

const clothingSchema = new Schema(
    {
        product_shopId: { type: Schema.Types.ObjectId, ref: SHOP_DOCUMENT_NAME },
        brand: { type: String, require: true },
        size: String,
        material: String,
    },
    { collection: COLLECTION_NAME, timestamps: true },
);

export default Clothing = model(DOCUMENT_NAME, clothingSchema);
export { DOCUMENT_NAME as CLOTHING_DOCUMENT_NAME };
