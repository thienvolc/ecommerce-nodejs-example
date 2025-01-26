import { RefreshTokenKey } from '../models/index.js';
import { castMongooseObjectId } from '../utils/mongooseUtils.js';

export default class RefreshTokenKeyRepository {
    static create = async (tokenKey) => await RefreshTokenKey.create(tokenKey);

    static findByShopId = async (shopId) => {
        const filter = { shopId: castMongooseObjectId(shopId) };
        return await RefreshTokenKey.findOne(filter).lean();
    };

    static findByShopIdAndUpdate = async (shopId, update, options = {}) => {
        const filter = { shopId: castMongooseObjectId(shopId) };
        return await RefreshTokenKey.findOneAndUpdate(filter, update, options).lean();
    };

    static deleteByShopId = async (shopId) => {
        const filter = { shopId: castMongooseObjectId(shopId) };
        return await RefreshTokenKey.deleteOne(filter).lean();
    };
}
