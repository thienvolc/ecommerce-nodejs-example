import { Product } from '../../models/index.js';
import { castMongooseObjectId } from '../../utils/mongooseUtils.js';
import { generateSelectProjectionForFields, generateUnselectProjectionForFields } from '../../utils/mongooseUtils.js';

export default class ProductBaseRepository {
    static create = async (productId, productDetails) => {
        const newProductDetails = {
            ...productDetails,
            _id: castMongooseObjectId(productId),
        };
        return await Product.create(newProductDetails);
    };

    static findAllProducts = async ({ filter, limit, page, sort, select, unselect }) => {
        const skip = (page - 1) * limit;
        const sortBy = sort === 'ctime' ? { _id: -1 } : { _id: 1 };
        const projection = select 
            ? generateSelectProjectionForFields(select)
            : generateUnselectProjectionForFields(unselect);
        return await Product
            .find(filter)
            .sort(sortBy)
            .skip(skip)
            .limit(limit)
            .select(projection);
    };

    static findById = async (productId) => {
        const id = castMongooseObjectId(productId);
        const options = { projection: { __v: 0 } };
        return await Product.findById(id, options);
    };

    static findByIdAndUpdate = async (productId, updateDetails) => {
        const id = castMongooseObjectId(productId);
        return await Product.findByIdAndUpdate(id, updateDetails);
    };

    static find = async (query) => {
        return await Product.find(query);
    };

    static deleteById = async (productId) => {
        const id = castMongooseObjectId(productId);
        return await Product.deleteById(id);
    };
}
