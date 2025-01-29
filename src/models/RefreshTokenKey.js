import { model, Schema } from 'mongoose';
import { DocumentName, CollectionName } from './constants/index.js';

const refreshTokenKeySchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: DocumentName.USER,
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
                validator: (tokens) => tokens.every((token) => typeof token === 'string' && token.length > 0),
                message: 'Used refresh tokens must be valid non-empty strings.',
            },
        },
    },
    { timestamps: true, collection: CollectionName.REFRESH_TOKEN_KEY },
);

export default model(DocumentName.REFRESH_TOKEN_KEY, refreshTokenKeySchema);
