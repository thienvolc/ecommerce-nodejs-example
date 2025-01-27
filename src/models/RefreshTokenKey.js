import { model, Schema } from 'mongoose';
import { SHOP_DOCUMENT_NAME } from './index.js';

const COLLECTION_NAME = 'refreshTokenKeys';
const DOCUMENT_NAME = 'RefreshTokenKey';

const refreshTokenKeySchema = new Schema(
    {
        shopId: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: SHOP_DOCUMENT_NAME,
            index: true,
        },
        publicKey: {
            type: String,
            required: true,
        },
        privateKey: {
            type: String,
            required: true,
            select: false,
        },
        refreshToken: {
            type: String,
            required: true,
            select: false,
        },
        usedRefreshTokens: {
            type: [String],
            default: [],
            validate: {
                validator: (tokens) => 
                    tokens.every((token) => typeof token === 'string' && token.length > 0),
                message: 'Used refresh tokens must be valid non-empty strings.',
            },
        },
    },
    { timestamps: true, collection: COLLECTION_NAME },
);

export default RefreshTokenKeyModel = model(DOCUMENT_NAME, refreshTokenKeySchema);
