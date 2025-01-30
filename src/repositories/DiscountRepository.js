import { Discount } from '../models/index.js';
import { generateSelectProjectionForFields, generateUnselectProjectionForFields } from '../utils/mongooseUtils.js';

export default class DiscountRepository {
    static findByCodeAndShopId = async ({ code, shopId }) => {
        return await Discount.findOne({ discount_code: code, discount_shopId: shopId }).lean();
    };

    static findOneAndDelete = async (filter) => {
        return await Discount.findOneAndDelete(filter);
    };

    static create = async (data) => {
        const discount = {
            ...data,
            discount_start_date: new Date(data.discount_start_date),
            discount_end_date: new Date(data.discount_end_date),
        };
        return await Discount.create(discount);
    };

    static findOne = async (filter) => {
        try {
            return await Discount.findOne({ filter }).lean();
        } catch (error) {
            throw new Error('Failed to find discount code');
        }
    };

    static findAllDiscountCodesSelect = async ({ limit = 50, page = 1, sort = 'ctime', filter, select }) => {
        const skip = (page - 1) * limit;
        const sortBy = getSortCriteria(sort);
        const projection = generateSelectProjectionForFields(select);
        return await Discount.find(filter).sort(sortBy).skip(skip).limit(limit).select(projection).lean();
    };

    static findAllDiscountCodesUnSelect = async ({ limit = 50, page = 1, sort = 'ctime', filter, unSelect }) => {
        const skip = (page - 1) * limit;
        const sortBy = getSortCriteria(sort);
        const projection = generateUnselectProjectionForFields(unSelect);
        return await Discount.find(filter).sort(sortBy).skip(skip).limit(limit).select(projection).lean();
    };

    static checkDiscountExists = async ({ model, filter }) => await model.findOne(filter);
}

const getSortCriteria = (sort) => (sort === 'ctime' ? { _id: -1 } : { _id: 1 });
