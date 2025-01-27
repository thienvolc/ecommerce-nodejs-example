import {
    castMongooseObjectId,
    createProductSlugFromName,
    updateNestedObjectParser,
    removeNullAndUndefinedProperties,
    isValidObject,
    generateSelectProjectionForFields,
    generateUnselectProjectionForFields,
    extractFieldsFromObject,
} from '../utils/mongooseUtils.js';
import { Product } from '../models/index.js';

import { getSelectData, getUnSelectData } from '../../utils/index.js';
import { productModel } from '../product.model.js';

export default class ProductRepository {
    static findById = async (productId) => await productModel.findById(productId).lean();

    static findByIdAndUpdate = async (productId, model, payload, options = { isNew: true }) => {
        return await model.findByIdAndUpdate(productId, payload, options);
    };

    static findProduct = async ({ product_id, unSelect }) => {
        unSelect = getUnSelectData(unSelect); // convert to {val: 0}
        const products = await productModel.findById(product_id).select(unSelect).lean();

        return products;
    };

    static findAllProducts = async ({ limit, sort, page, filter, select }) => {
        select = getSelectData(select); // convert to {val: 1}
        const skip = (page - 1) * limit;
        const sortBy = sort === 'ctime' ? { _id: -1 } : { _id: 1 };
        const products = await productModel.find(filter).sort(sortBy).skip(skip).limit(limit).select(select).lean();

        return products;
    };

    static searchProductsByUser = async ({ keySearch }) => {
        const regexSearch = new RegExp(keySearch);

        const results = await productModel
            .find({ isDraft: false, $text: { $search: regexSearch } }, { score: { $meta: 'textScore' } })
            .sort({ score: { $meta: 'textScore' } })
            .lean();

        return results;
    };

    static unPublishProductByShop = async ({ product_shop, product_id }) => {
        const foundShop = await productModel.findOneAndUpdate(
            { product_shop, _id: product_id },
            { $set: { isDraft: true, isPublished: false } },
        );

        return !foundShop ? null : foundShop;
    };

    static publishProductByShop = async ({ product_shop, product_id }) => {
        const foundShop = await productModel.findOneAndUpdate(
            { product_shop, _id: product_id },
            { $set: { isDraft: false, isPublished: true } },
        );

        return !foundShop ? null : foundShop;
    };

    static findAllDraftsForShop = async ({ query, limit, skip }) => {
        return await queryProduct({ query, limit, skip });
    };

    static findAllPublishForShop = async ({ query, limit, skip }) => {
        return await queryProduct({ query, limit, skip });
    };

    static queryProduct = async ({ query, limit, skip }) => {
        return await productModel
            .find(query)
            .populate('product_shop', 'name email -_id')
            .sort({ updateAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean()
            .exec();
    };
}
