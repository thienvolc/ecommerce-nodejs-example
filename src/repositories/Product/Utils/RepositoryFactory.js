import {
    castMongooseObjectId,
    updateNestedObjectParser,
    removeNullAndUndefinedProperties,
    generateSelectProjectionForFields,
    generateUnselectProjectionForFields,
} from '../../../utils/mongooseUtils.js';
import { Product, Furniture, Clothing, Electronics, ProductType } from '../../../models/index.js';

const convertToUpdateNestedObject = (product) => {
    const updatedProduct = updateNestedObjectParser(product);
    return removeNullAndUndefinedProperties(updatedProduct);
};

class BaseRepository {
    #model;

    constructor(model) {
        this.#model = model;
    }

    create = async (productDetails) => {
        return await this.#model.create(productDetails);
    };

    findById = async (productId, fields) => {
        const id = castMongooseObjectId(productId);
        const projection = generateSelectProjectionForFields(fields);
        return await this.#model.findById(id, projection).lean();
    };

    findByIdAndUpdate = async (productId, productDetails) => {
        const id = castMongooseObjectId(productId);
        const updatedProduct = convertToUpdateNestedObject(productDetails);
        const product = await this.#model.findByIdAndUpdate(id, updatedProduct, { new: true }).lean();
        return product;
    };

    deleteById = async (productId) => {
        const id = castMongooseObjectId(productId);
        return await this.#model.findByIdAndDelete(id).lean();
    };
}

class ProductRepository extends BaseRepository {
    constructor() {
        super(Product);
    }
}

class FurnitureRepository extends BaseRepository {
    constructor() {
        super(Furniture);
    }
}

class ClothingRepository extends BaseRepository {
    constructor() {
        super(Clothing);
    }
}

class ElectronicsRepository extends BaseRepository {
    constructor() {
        super(Electronics);
    }
}

class RepositoryFactory {
    static repositoryMap = {
        [ProductType.FURNITURE]: FurnitureRepository,
        [ProductType.CLOTHING]: ClothingRepository,
        [ProductType.ELECTRONICS]: ElectronicsRepository,
        [ProductType.BASE]: ProductRepository,
    };

    static getRepository = (productType) => {
        const Repository = this.repositoryMap[productType];
        return new Repository();
    };
}

export { RepositoryFactory as default, ProductType };
