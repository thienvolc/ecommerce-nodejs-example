import { ProductRepositoryBridge as ProductRepository } from '../repositories/index.js';

class ProductService {
    static createProduct = async (productDetails) => {
        return await ProductRepository.create(productDetails);
    };

    static updateProduct = async (productDetails) => {
        return await ProductRepository.findByIdAndUpdate(productDetails.product_id, productDetails);
    };

    static getProductById = async (productId) => {
        return await ProductRepository.findById(productId);
    };

    static getAllProducts = async (query) => {};

    static searchProducts = async (query) => {};

    static unPublishProductByShop = async (body) => {};

    static publishProductByShop = async (body) => {};

    static findAllDraftsForShop = async (shopId) => {};

    static findAllPublishForShop = async (shopId) => {};
}

export default ProductService;
