import { BadRequestError } from '../core/error.response.js';
import { productModel, clothingModel, electronicModel, furnitureModel } from '../models/product.model.js';
import { insertInventory } from '../models/repositories/inventory.repo.js';
import ProductRepository from '../repositories/ProductRepo.js';
import { removeUndefinedObject, updateNestedObjectParser } from '../utils/index.js';

export default class ProductFactory {
    static async updateProduct(type, productId, payload) {
        const productClass = ProductFactory.productRegistry[type];
        if (!productClass) throw new BadRequestError(`Invalid product type: ${type}`);

        return new productClass(payload).updateProduct(productId);
    }

    static async findProduct({ product_id }) {
        return await ProductRepository.findProduct({ product_id, unSelect: ['__v'] });
    }

    static async findAllProducts({ limit = 50, sort = 'ctime', page = 1, filter = { isPublished: true } }) {
        return await ProductRepository.findAllProducts({
            limit,
            sort,
            page,
            filter,
            select: ['product_name', 'product_price', 'product_thumb'],
        });
    }

    static async searchProducts({ keySearch }) {
        return await searchProductsByUser({ keySearch });
    }

    static async searchProducts({ keySearch }) {
        return await searchProductsByUser({ keySearch });
    }

    static async publishProductByShop({ product_shop, product_id }) {
        return await ProductRepository.publishProductByShop({ product_shop, product_id });
    }

    static async unPublishProductByShop({ product_shop, product_id }) {
        return await ProductRepository.unPublishProductByShop({ product_shop, product_id });
    }

    static async findAllDraftsForShop({ product_shop, limit = 50, skip = 0 }) {
        const query = { product_shop, isDraft: true };
        return await ProductRepository.findAllDraftsForShop({ query, limit, skip });
    }

    static async findAllPublishForShop({ product_shop, limit = 50, skip = 0 }) {
        const query = { product_shop, isPublished: true };
        return await ProductRepository.findAllPublishForShop({ query, limit, skip });
    }

    static productRegistry = {};

    static registerProductType(type, classRef) {
        ProductFactory.productRegistry[type] = classRef;
    }

    static async createProduct(payload) {
        const type = payload.product_type;
        const productClass = ProductFactory.productRegistry[type];
        if (!productClass) throw new BadRequestError(`Invalid product type: ${type}`);

        return new productClass(payload).createProduct();
    }
}

class Product {
    constructor({
        product_name,
        product_thumb,
        product_price,
        product_quantity,
        product_type,
        product_shop,
        product_attributes,
    }) {
        const info = {
            product_name,
            product_thumb,
            product_price,
            product_quantity,
            product_type,
            product_shop,
            product_attributes,
        };
        Object.assign(this, info);
    }

    async createProduct(product_id) {
        const newProduct = await productModel.create({ ...this, _id: product_id });
        if (newProduct)
            await insertInventory({ productId: product_id, shopId: this.product_shop, stock: this.product_quantity });

        return newProduct;
    }

    async updateProduct(productId, payload) {
        return await ProductRepository.updateProductById(productId, productModel, payload);
    }
}

class Clothing extends Product {
    async createProduct() {
        const newClothing = new clothingModel({ ...this.product_attributes, product_shop: this.product_shop });
        if (!newClothing) throw new BadRequestError('Create new clothing error');
        const newProduct = await super.createProduct(newClothing._id);
        await newClothing.save();

        return newProduct;
    }

    async updateProduct(productId) {
        /**
         * 1. remove undefined, null
         * check
         */

        const product_attributes = updateNestedObjectParser(this.product_attributes);
        removeUndefinedObject(product_attributes);
        if (product_attributes) {
            // update child
            await ProductRepository.updateProductById(productId, clothingModel, product_attributes);
        }
        const objectParams = updateNestedObjectParser(this);
        removeUndefinedObject(objectParams);
        const updatedObject = await super.updateProduct(productId, objectParams);

        return updatedObject;
    }
}
//#region: hihi
class Electronics extends Product {
    async createProduct() {
        const newElectronic = new electronicModel({
            ...this.product_attributes,
            product_shop: this.product_shop,
        });
        if (!newElectronic) throw new BadRequestError('Create new electronic error');
        const newProduct = await super.createProduct(newElectronic._id);
        await newElectronic.save();

        return newProduct;
    }

    async updateProduct(productId) {
        const product_attributes = updateNestedObjectParser(this.product_attributes);
        removeUndefinedObject(product_attributes);
        if (product_attributes) {
            // update child
            await ProductRepository.updateProductById(productId, electronicModel, product_attributes);
        }
        const objectParams = updateNestedObjectParser(this);
        removeUndefinedObject(objectParams);
        const updatedObject = await super.updateProduct(productId, objectParams);

        return updatedObject;
    }
}
//#endregion
// MARK: hihi
class Furniture extends Product {
    async createProduct() {
        const newFurniture = new furnitureModel({
            ...this.product_attributes,
            product_shop: this.product_shop,
        });
        if (!newFurniture) throw new BadRequestError('Create new furniture error');
        const newProduct = await super.createProduct(newFurniture._id);
        await newFurniture.save();

        return newProduct;
    }

    async updateProduct(productId) {
        const product_attributes = updateNestedObjectParser(this.product_attributes);
        removeUndefinedObject(product_attributes);
        if (product_attributes) {
            // update child
            await ProductRepository.updateProductById(productId, furnitureModel, product_attributes);
        }
        const objectParams = updateNestedObjectParser(this);
        removeUndefinedObject(objectParams);
        const updatedObject = await super.updateProduct(productId, objectParams);

        return updatedObject;
    }
}

ProductFactory.registerProductType('Electronics', Electronics);
ProductFactory.registerProductType('Furniture', Furniture);
ProductFactory.registerProductType('Clothing', Clothing);
