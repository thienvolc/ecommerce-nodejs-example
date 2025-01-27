import { resolveRepositoryManagerByProductType, ProductType } from './Utils/index.js';
// import { ProductRepositoryManager } from './RepositoryManagers/index.js';

export default class ProductRepositoryBridge {
    static resolveFactory = (productType) => resolveRepositoryManagerByProductType(productType);

    static create = async (productDetails) => {
        const Factory = this.resolveFactory(productDetails.product_type);
        return await Factory.create(productDetails);
    };

    static findByIdAndUpdate = async (productId, updateDetails) => {
        const Factory = this.resolveFactory(productDetails.product_type);
        return await Factory.findByIdAndUpdate(productId, updateDetails);
    };

    static findById = async (productId) => {
        const Factory = this.resolveFactory(ProductType.BASE);
        return await Factory.findById(productId);
    };

    static deleteById = async (productId) => {
        return await Factory.deleteById(productId);
    };
}
