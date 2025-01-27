import { model, Schema } from 'mongoose';
import { PRODUCT_DOCUMENT_NAME, SHOP_DOCUMENT_NAME } from './index.js';

const DOCUMENT_NAME = 'Inventory';
const COLLECTION_NAME = 'inventories';

const inventorySchema = new Schema(
    {
        inven_productId: { type: Schema.Types.ObjectId, ref: PRODUCT_DOCUMENT_NAME, required: true },
        inven_shopId: { type: Schema.Types.ObjectId, ref: SHOP_DOCUMENT_NAME, required: true },
        inven_location: { type: String, default: 'unknow' },
        inven_stock: { type: Number, required: true },
        inven_reservations: { type: Array, default: [] },
    },
    { timestamps: true, collection: COLLECTION_NAME },
);

inventorySchema.index({ inven_productId: 1, inven_shopId: 1 });

export default Inventory =  model(DOCUMENT_NAME, inventorySchema);
