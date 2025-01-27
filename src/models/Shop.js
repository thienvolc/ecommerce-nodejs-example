import { model, Schema } from 'mongoose';

const COLLECTION_NAME = 'shops';
const DOCUMENT_NAME = 'Shop';

const shopSchema = new Schema(
    {
        name: {
            type: String,
            required: [true, 'Shop name is required'],
            unique: true,
            trim: true,
        },
        description: {
            type: String,
            maxlength: [500, 'Description cannot exceed 500 characters'],
            maxlength: 500,
        },
        logo: {
            type: String,
            trim: true,
        },
        banner: {
            type: String,
        },
        location: {
            type: String,
            maxlength: [250, 'Location cannot exceed 250 characters'],
            maxlength: 250,
        },
        ownerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'Shop owner is required'],
        },
        contact: {
            email: {
                type: String,
                trim: true,
                lowercase: true,
                validate: {
                    validator: (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
                    message: 'Invalid email format',
                },
            },
            phone: {
                type: String,
                validate: {
                    validator: (phone) => /^\+?[0-9]{7,15}$/.test(phone),
                    message: 'Invalid phone number format',
                },
            },
        },
        products: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
            },
        ],
        rating: {
            type: Number,
            min: [0, 'Rating cannot be less than 0'],
            max: [5, 'Rating cannot exceed 5'],
            default: 0,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true, collection: COLLECTION_NAME },
);

shopSchema.index({ name: 1, ownerId: 1 }, { unique: true });
shopSchema.index({ 'contact.email': 1 });

export default Shop = model(DOCUMENT_NAME, shopSchema);
