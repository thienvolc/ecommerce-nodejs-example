import { model, Schema } from 'mongoose';
import { Permissions, DocumentName, CollectionName } from './constants/index.js';

const apikeySchema = new Schema(
    {
        key: {
            type: String,
            required: true,
            unique: true,
        },
        status: {
            type: String,
            required: true,
            enum: ['active', 'inactive'],
            default: 'active',
        },
        permissions: {
            type: [String],
            required: true,
            enum: Object.values(Permissions),
            default: Permissions.READ,
        },
    },
    { timestamps: true, collection: CollectionName.API_KEY },
);

apikeySchema.index({ status: 1 });

export default model(DocumentName.API_KEY, apikeySchema);
