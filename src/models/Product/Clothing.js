import { Schema, model } from 'mongoose';
import { DocumentName, CollectionName } from '../constants/index.js';

const clothingSchema = new Schema(
    {
        product_shopId: { type: Schema.Types.ObjectId, ref: DocumentName.SHOP, required: true },
        brand: { type: String, require: true },
        size: String,
        material: String,
    },
    { timestamps: true, collection: CollectionName.CLOTHING },
);

export default model(DocumentName.CLOTHING, clothingSchema);
