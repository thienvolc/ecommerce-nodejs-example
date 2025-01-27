import { model, Schema } from 'mongoose';

const DOCUMENT_NAME = 'Apikey';
const COLLECTION_NAME = 'apikeys';

const Permissions = {
    READ: '0000',
    WRITE: '1111',
    DELETE: '2222',
    ADMIN: '3333',
};

Permissions.DESCRIPTIONS = {
    [Permissions.READ]: 'read',
    [Permissions.WRITE]: 'write',
    [Permissions.DELETE]: 'delete',
    [Permissions.ADMIN]: 'admin',
};

Permissions.getPermissionName = function (code) {
    return this.DESCRIPTIONS[code] || 'unknown';
};

Permissions.isValidPermission = function (code) {
    return Object.values(this).includes(code);
};

const ApikeySchema = new Schema(
    {
        key: {
            type: String,
            required: true,
            unique: true,
        },
        status: {
            type: Boolean,
            default: true,
        },
        permissions: {
            type: [String],
            required: true,
            enum: Object.values(Permissions),
            default: Permissions.READ,
        },
    },
    {
        timestamps: true,
        collection: COLLECTION_NAME,
    },
);

ApikeySchema.index({ status: 1 });

export default ApiKey = model(DOCUMENT_NAME, ApikeySchema);
export { Permissions };
