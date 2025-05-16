import { model, Schema } from 'mongoose';
import { DocumentName, CollectionName } from './constants/index.js';

const userSchema = new Schema(
    {
        name: {
            type: String,
            index: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            index: true,
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
        avatar: {
            type: String,
            default: '',
        },
        role: {
            type: String,
            enum: ['user', 'admin'],
            default: 'user',
        },

    },
    { timestamps: true, collection: CollectionName.USER },
);

userSchema.index({ name: 'text' });

export default model(DocumentName.USER, userSchema);
