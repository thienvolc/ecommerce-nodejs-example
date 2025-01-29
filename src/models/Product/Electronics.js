import { Schema, model } from 'mongoose';
import { DocumentName, CollectionName } from '../constants/index.js';

const electronicsSchema = new Schema(
    {
        product_shopId: { type: Schema.Types.ObjectId, ref: DocumentName.SHOP, required: true },
        manufacturer: { type: String, require: true },
        model: String,
        color: String,
    },
    { timestamps: true, collection: CollectionName.ELECTRONICS },
);

export default model(DocumentName.ELECTRONICS, electronicsSchema);
