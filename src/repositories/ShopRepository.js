import { Shop } from '../models/index.js';

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
        return await Shop.findOne({ email }).select(select).lean();
    };

    static findById = async (shopId, select = defaultSelect) => {
        return await Shop.findById(shopId).select(select).lean();
    };
}
