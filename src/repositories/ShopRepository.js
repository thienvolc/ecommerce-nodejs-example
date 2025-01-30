import { Shop } from '../models/index.js';
import { castMongooseObjectId } from '../utils/mongooseUtils.js';

const defaultSelect = {
    _id: 1,
    email: 1,
    password: 1,
    name: 1,
    status: 1,
    roles: 1,
};

export default class ShopRepository {
    static create = async (shop) => await Shop.create(shop);

    static findByEmail = async (email, select = defaultSelect) => {
        return await Shop.findOne({
            'contact.email': email,
        })
            .select(select)
            .lean();
    };

    static findByName = async (name, select = defaultSelect) => {
        return await Shop.findOne({
            name: {
                $regex: new RegExp(name, 'i'),
            },
        })
            .select(select)
            .lean();
    };

    static findById = async (shopId, select = defaultSelect) => {
        return await Shop.findById(shopId).select(select).lean();
    };

    static getShopByOwnerId = async (ownerId) => {
        const id = castMongooseObjectId(ownerId);
        return await Shop.findOne({ ownerId: id }).lean();
    };
}
