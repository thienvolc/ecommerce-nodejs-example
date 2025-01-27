import { RepositoryFactory, ProductType } from '../Utils/index.js';

class ProductRepositoryManager {
    static #repository = RepositoryFactory.getRepository(ProductType.BASE);

    static create = async (productId, productDetails) => {
        const newProductDetails = {
            ...productDetails,
            _id: productId,
        };
        return await this.#repository.create(newProductDetails);
    };

    static findById = async (productId) => {
        return await this.#repository.findById(productId);
    };

    static findByIdAndUpdate = async (productId, updateDetails) => {
        return await this.#repository.findByIdAndUpdate(productId, updateDetails);
    };

    static deleteById = async (productId) => {
        return await this.#repository.findById(productId);
    };
}

export default ProductRepositoryManager;
