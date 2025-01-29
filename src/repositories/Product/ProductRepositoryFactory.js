import ModelBridgeFactory, { ProductType } from './ModelBridgeFactory.js';

class ProductRepository {
    static #model = ModelBridgeFactory.getModelBridge(ProductType.BASE);

    static create = async (productId, productDetails) => {
        const newProductDetails = {
            ...productDetails,
            _id: productId,
        };
        return await this.#model.create(newProductDetails);
    };

    static findById = async (productId) => {
        return await this.#model.findById(productId);
    };

    static findByIdAndUpdate = async (productId, updateDetails) => {
        return await this.#model.findByIdAndUpdate(productId, updateDetails);
    };

    static deleteById = async (productId) => {
        return await this.#model.findById(productId);
    };
}

class ClothingRepository {
    static #model = ModelBridgeFactory.getModelBridge(ProductType.CLOTHING);

    static create = async (productDetails) => {
        const clothing = await this.#model.create(productDetails);
        const productId = clothing._id;
        try {
            return await ProductRepository.create(productId, productDetails);
        } catch (error) {
            await this.#model.deleteById(productDetails._id);
        }
    };

    static findByIdAndUpdate = async (productId, updateDetails) => {
        const productAttributes = updateDetails.product_attributes;
        await this.#model.findByIdAndUpdate(productId, productAttributes);
        const product = await ProductRepository.findByIdAndUpdate(productId, updateDetails);
        return product;
    };

    static deleteById = async (productId) => {
        await this.#model.deleteById(productId);
        await ProductRepository.deleteById(productId);
    };
}

class ElectronicsRepository {
    static #model = ModelBridgeFactory.getModelBridge(ProductType.ELECTRONICS);

    static create = async (productDetails) => {
        const electronics = await this.#model.create(productDetails);
        const productId = electronics._id;
        try {
            return await ProductRepository.create(productId, productDetails);
        } catch (error) {
            await this.#model.deleteById(productDetails._id);
        }
    };

    static findByIdAndUpdate = async (productId, updateDetails) => {
        const productAttributes = updateDetails.product_attributes;
        await this.#model.findByIdAndUpdate(productId, productAttributes);
        const product = await ProductRepository.findByIdAndUpdate(productId, updateDetails);
        return product;
    };

    static deleteById = async (productId) => {
        await this.#model.deleteById(productId);
        await ProductRepository.deleteById(productId);
    };
}

class FurnitureRepository {
    static #model = ModelBridgeFactory.getModelBridge(ProductType.FURNITURE);

    static create = async (productDetails) => {
        const furniture = await this.#model.create(productDetails);
        const productId = furniture._id;
        try {
            return await ProductRepository.create(productId, productDetails);
        } catch (error) {
            await this.#model.deleteById(productDetails._id);
        }
    };

    static findByIdAndUpdate = async (productId, updateDetails) => {
        const productAttributes = updateDetails.product_attributes;
        await this.#model.findByIdAndUpdate(productId, productAttributes);
        const product = await ProductRepository.findByIdAndUpdate(productId, updateDetails);
        return product;
    };

    static deleteById = async (productId) => {
        await this.#model.deleteById(productId);
        await ProductRepository.deleteById(productId);
    };
}

class ProductRepositoryFactory {
    static repositoryMap = {
        [ProductType.FURNITURE]: FurnitureRepository,
        [ProductType.CLOTHING]: ClothingRepository,
        [ProductType.ELECTRONICS]: ElectronicsRepository,
    };

    static getRepository = (productType) => this.repositoryMap[productType];
}

export { ProductRepositoryFactory as default, ProductRepository };
