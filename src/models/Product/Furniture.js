import { Schema, model } from 'mongoose';
import { SHOP_DOCUMENT_NAME } from '../index.js';

const COLLECTION_NAME = 'furnitures';
const DOCUMENT_NAME = 'Furniture';

const furnitureSchema = new Schema(
    {
        product_shopId: { type: Schema.Types.ObjectId, ref: SHOP_DOCUMENT_NAME },
        brand: { type: String, require: true },
        size: String,
        material: String,
    },
    { collection: COLLECTION_NAME, timestamps: true },
);

export default Furniture = model(DOCUMENT_NAME, furnitureSchema);
export { DOCUMENT_NAME as FURNITURE_DOCUMENT_NAME };
