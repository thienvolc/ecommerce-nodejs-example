import { ProductRepositoryBridgeStrategyFactory, ProductBaseRepository } from '../repositories/index.js';

class ProductService {
    static #productRepositoryBridgeStrategyFactory = ProductRepositoryBridgeStrategyFactory;
    static #productBaseRepository = ProductBaseRepository;

    static createProduct = async (productDetails) => {
        const Repository = this.#productRepositoryBridgeStrategyFactory.getStrategy(productType);
        return await Repository.create(productDetails);
    };

    static updateProduct = async (productDetails) => {
        const Repository = this.#productRepositoryBridgeStrategyFactory.getStrategy(productType);
        return await Repository.findByIdAndUpdate(productDetails.product_id, productDetails);
    };

    static getProductById = async (productId) => await this.#productBaseRepository.findById(productId);

    static getAllProducts = async (query) => await this.#productBaseRepository.find(query);

    static searchProducts = async (search) => await this.#productBaseRepository.find(search);

    static unPublishProductByShop = async (body) =>
        await this.#productBaseRepository.findByIdAndUpdate(body.product_id, { product_status: 'draft' });

    static publishProductByShop = async (body) =>
        await this.#productBaseRepository.findByIdAndUpdate(body.product_id, { product_status: 'published' });

    static findAllDraftsForShop = async (shopId) =>
        await this.#productBaseRepository.find({ product_shopId: shopId, product_status: 'draft' });

    static findAllPublishForShop = async (shopId) =>
        await this.#productBaseRepository.find({ product_shopId: shopId, product_status: 'published' });
}

export default ProductService;
