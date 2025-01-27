import { RepositoryFactory, ProductType } from '../Utils/index.js';
import ProductRepositoryManager from './ProductRepositoryManager.js';

class ClothingRepositoryManager {
    static #repository = RepositoryFactory.getRepository(ProductType.FURNITURE);

    static create = async (productDetails) => {
        const clothing = await this.#repository.create(productDetails);
        const productId = clothing._id;
        try {
            return await ProductRepositoryManager.create(productId, productDetails);
        } catch (error) {
            await this.#repository.deleteById(productDetails._id);
        }
    };

    static findByIdAndUpdate = async (productId, updateDetails) => {
        const productAttributes = updateDetails.product_attributes;
        await this.#repository.findByIdAndUpdate(productId, productAttributes);
        const product = await ProductRepositoryManager.findByIdAndUpdate(productId, updateDetails);
        return product;
    };

    static deleteById = async (productId) => {
        await this.#repository.deleteById(productId);
        await ProductRepositoryManager.deleteById(productId);
    };
}

export default ClothingRepositoryManager;
