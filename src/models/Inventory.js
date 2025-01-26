import { model, Schema } from 'mongoose';

const DOCUMENT_NAME = 'Inventory';
const COLLECTION_NAME = 'inventories';

const inventorySchema = new Schema(
    {
        inven_productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
        inven_shopId: { type: Schema.Types.ObjectId, ref: 'Shop', required: true },
        inven_location: { type: String, default: 'unknow' },
        inven_stock: { type: Number, required: true },
        inven_reservations: { type: Array, default: [] },
    },
    { timestamps: true, collection: COLLECTION_NAME },
);

inventorySchema.index({ inven_productId: 1, inven_shopId: 1 });

export default model(DOCUMENT_NAME, inventorySchema);
