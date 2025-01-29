import ProductService from '../services/ProductService.js';
import { ResponseSender, CREATED, OK } from '../utils/responses/index.js';
import { asyncErrorDecorator } from '../helpers/asyncErrorWrapper.js';

class ProductController {
    // [POST] /product
    static createProduct = async (req, res, next) => {
        const productData = {
            ...req.body,
            product_shopId: req.user.shopId,
        };
        const metadata = await ProductService.createProduct(productData);
        const resopnse = new CREATED({ message: 'Product created successfully', metadata });
        ResponseSender.send(res, resopnse);
    };

    // [PATCH] /product/:id
    static updateProduct = async (req, res, next) => {
        const productData = {
            ...req.body,
            product_id: req.params.id,
            product_shopId: req.user.shopId,
        };
        const metadata = await ProductService.updateProduct(productData);
        const resposne = new OK({ message: 'Product updated successfully', metadata });
        ResponseSender.send(res, resposne);
    };

    // [GET] /product/:id
    static getProductById = async (req, res, next) => {
        const productId = req.params.id;
        const metadata = await ProductService.getProductById(productId);
        const response = new OK({ message: 'Product retrieved successfully', metadata });
        ResponseSender.send(res, response);
    };

    // [GET] /product
    static getAllProducts = async (req, res, next) => {
        const metadata = await ProductService.getAllProducts(req.query);
        const response = new OK({ message: 'All products retrieved successfully', metadata });
        ResponseSender.send(res, response);
    };

    // [GET] /product/search/:search
    static searchProducts = async (req, res, next) => {
        const metadata = await ProductService.searchProducts(req.query);
        const response = new OK({ message: 'Products search successful', metadata });
        ResponseSender.send(res, response);
    };

    // [POST] /product/unpublish/:id
    static unpublishProduct = async (req, res, next) => {
        const body = {
            product_shopId: req.user.shopId,
            product_id: req.params.id,
        };
        const metadata = await ProductService.unPublishProductByShop(body);
        const response = new OK({ message: 'Product unpublished successfully', metadata });
        ResponseSender.send(res, response);
    };

    // [POST] /product/publish/:id
    static publishProduct = async (req, res, next) => {
        const body = {
            product_shopId: req.user.shopId,
            product_id: req.params.id,
        };
        const metadata = await ProductService.publishProductByShop(body);
        const response = new OK({ message: 'Product published successfully', metadata });
        ResponseSender.send(res, response);
    };

    // [GET] /product/drafts/all
    static getAllDraftProducts = async (req, res, next) => {
        const shopId = req.user.shopId;
        const metadata = await ProductService.findAllDraftsForShop(shopId);
        const response = new OK({ message: 'Draft products retrieved successfully', metadata });
        ResponseSender.send(res, response);
    };

    // [GET] /product/publish/all
    static getAllPublishedProducts = async (req, res, next) => {
        const shopId = req.user.shopId;
        const metadata = await ProductService.findAllPublishForShop(shopId);
        const response = new OK({ message: 'Published products retrieved successfully', metadata });
        ResponseSender.send(res, response);
    };
}

export default asyncErrorDecorator.decorateAllStaticMethods(ProductController);
