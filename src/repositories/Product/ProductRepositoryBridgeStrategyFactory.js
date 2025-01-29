import ProductBaseRepository from './ProductBaseRepository.js';
import { Clothing, Furniture, Electronics, ProductType } from '../../models/index.js';

class ModelRepositoryBridgeStrategy {
    // For the sake of suggestion, it should be an abstract class, not care about the implementation
    #modelStrategy = Clothing;

    constructor(modelStrategy) {
        this.#modelStrategy = modelStrategy;
    }

    create = async (productDetails) => {
        const product = await this.#modelStrategy.create(productDetails);
        const productId = product._id;
        try {
            return await ProductBaseRepository.create(productId, productDetails);
        } catch (error) {
            await this.#modelStrategy.deleteById(productDetails._id);
        }
    };

    findByIdAndUpdate = async (productId, updateDetails) => {
        const productAttributes = updateDetails.product_attributes;
        await this.#modelStrategy.findByIdAndUpdate(productId, productAttributes);
        return await ProductBaseRepository.findByIdAndUpdate(productId, updateDetails);
    };

    deleteById = async (productId) => {
        await this.#modelStrategy.deleteById(productId);
        return await ProductBaseRepository.deleteById(productId);
    };
}

class ClothingRepositoryBridgeStrategy extends ModelRepositoryBridgeStrategy {
    constructor() {
        super(Clothing);
    }
}

class FurnitureRepositoryBridgeStrategy extends ModelRepositoryBridgeStrategy {
    constructor() {
        super(Furniture);
    }
}

class ElectronicsRepositoryBridgeStrategy extends ModelRepositoryBridgeStrategy {
    constructor() {
        super(Electronics);
    }
}

export default class ProductRepositoryBridgeStrategyFactory {
    static repositoryMap = {
        [ProductType.CLOTHING]: new ClothingRepositoryBridgeStrategy(),
        [ProductType.FURNITURE]: new FurnitureRepositoryBridgeStrategy(),
        [ProductType.ELECTRONICS]: new ElectronicsRepositoryBridgeStrategy(),
    };

    static getStrategy = (productType) => this.repositoryMap[productType];
}
