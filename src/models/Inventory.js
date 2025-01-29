import { model, Schema } from 'mongoose';
import { DocumentName, CollectionName } from './constants/index.js';

const inventorySchema = new Schema(
    {
        inven_productId: { type: Schema.Types.ObjectId, ref: DocumentName.PRODUCT, required: true },
        inven_shopId: { type: Schema.Types.ObjectId, ref: DocumentName.SHOP, required: true },
        inven_location: { type: String, default: 'unknow' },
        inven_stock: { type: Number, required: true },
        inven_reservations: { type: Array, default: [] },
    },
    { timestamps: true, collection: CollectionName.INVENTORY },
);

inventorySchema.index({ inven_productId: 1, inven_shopId: 1 });

export default model(DocumentName.INVENTORY, inventorySchema);
