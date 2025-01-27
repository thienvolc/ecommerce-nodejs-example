import { model, Schema } from 'mongoose';

const COLLECTION_NAME = 'users';
const DOCUMENT_NAME = 'User';

const shopSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,
            index: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            validate: {
                validator: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value), // Simple email regex
                message: (props) => `${props.value} is not a valid email address!`,
            },
        },
        password: {
            type: String,
            required: true,
            minlength: [6, 'Password must be at least 6 characters long.'],
        },
        status: {
            type: String,
            enum: ['active', 'inactive'],
            default: 'active',
        },
        verify: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true, collection: COLLECTION_NAME },
);

shopSchema.index({ email: 1 });

export default User = model(DOCUMENT_NAME, shopSchema);
