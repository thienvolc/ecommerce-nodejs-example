import { ProductRepositoryBridgeStrategyFactory, ProductBaseRepository } from '../repositories/index.js';

class ProductService {
    static createProduct = async (productDetails) => {
        const Repository = ProductRepositoryBridgeStrategyFactory.getStrategy(productType);
        return await Repository.create(productDetails);
    };

    static updateProduct = async (productDetails) => {
        const Repository = ProductRepositoryBridgeStrategyFactory.getStrategy(productType);
        return await Repository.findByIdAndUpdate(productDetails.product_id, productDetails);
    };

    static getProductById = async (productId) => {
        return await ProductBaseRepository.findById(productId);
    };

    static getAllProducts = async (query) => {
        return await ProductBaseRepository.find(query);
    };

    static searchProducts = async (search) => {
        return await ProductBaseRepository.find(search);
    };

    static unPublishProductByShop = async (body) => {
        return await ProductBaseRepository.findByIdAndUpdate(body.product_id, { product_status: 'draft' });
    };

    static publishProductByShop = async (body) => {
        return await ProductBaseRepository.findByIdAndUpdate(body.product_id, { product_status: 'published' });
    };

    static findAllDraftsForShop = async (shopId) => {
        return await ProductBaseRepository.find({ product_shopId: shopId, product_status: 'draft' });
    };

    static findAllPublishForShop = async (shopId) => {
        return await ProductBaseRepository.find({ product_shopId: shopId, product_status: 'published' });
    };
}

export default ProductService;
