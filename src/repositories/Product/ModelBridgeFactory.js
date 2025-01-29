import { Clothing, Product, Furniture, Electronics, ProductType } from '../models/index.js';
import {
    convertToUpdateNestedObject,
    castMongooseObjectId,
    generateSelectProjectionForFields,
    generateUnselectProjectionForFields,
} from '../utils/mongooseUtils.js';

class BaseModelBridge {
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
        return await this.#model.findByIdAndUpdate(id, updatedProduct, { new: true }).lean();
    };

    deleteById = async (productId) => {
        const id = castMongooseObjectId(productId);
        return await this.#model.findByIdAndDelete(id).lean();
    };
}

class ProductBridge extends BaseModelBridge {
    constructor() {
        super(Product);
    }
}

class FurnitureBridge extends BaseModelBridge {
    constructor() {
        super(Furniture);
    }
}

class ClothingBridge extends BaseModelBridge {
    constructor() {
        super(Clothing);
    }
}

class ElectronicsBridge extends BaseModelBridge {
    constructor() {
        super(Electronics);
    }
}

class ModelBridgeFactory {
    static modelBridgeMap = {
        [ProductType.FURNITURE]: ProductBridge,
        [ProductType.CLOTHING]: FurnitureBridge,
        [ProductType.ELECTRONICS]: ClothingBridge,
        [ProductType.BASE]: ElectronicsBridge,
    };

    static getModelBridge = (productType) => {
        const ModelBridge = this.modelBridgeMap[productType];
        return new ModelBridge();
    };
}

export { ModelBridgeFactory as default, ProductType };
