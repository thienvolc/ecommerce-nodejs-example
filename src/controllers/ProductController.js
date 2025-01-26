import ProductService from '../services/ProductService.js';
import { ResponseSender, CREATED, OK } from '../utils/responses/index.js';
import { asyncErrorDecorator } from '../helpers/asyncErrorWrapper.js';

class ProductController {
    createProduct = async (req, res, next) => {
        const resposne = new CREATED({
            message: 'Create new product successful',
            metadata: await ProductService.createProduct(req.body.product_type, {
                ...req.body,
                product_shop: req.user.userId,
            }),
        });
        ResponseSender.send(res, resposne);
    };

    updateProduct = async (req, res, next) => {
        const resposne = new OK({
            message: 'Update product successful',
            metadata: await ProductService.updateProduct(req.body.product_type, req.params.id, {
                ...req.body,
                product_shop: req.user.userId,
            }),
        });
        ResponseSender.send(res, resposne);
    };

    findProduct = async (req, res, next) => {
        const resposne = new OK({
            message: 'Get one product successful',
            metadata: await ProductService.findProduct({ product_id: req.params.id }),
        });
        ResponseSender.send(res, resposne);
    };

    findAllProducs = async (req, res, next) => {
        const resposne = new OK({
            message: 'Get list all products successful',
            metadata: await ProductService.findAllProducts(req.query),
        });
        ResponseSender.send(res, resposne);
    };

    getListSearchProduct = async (req, res, next) => {
        const resposne = new OK({
            message: 'Get list product successful',
            metadata: await ProductService.searchProducts(req.params),
        });
        ResponseSender.send(res, resposne);
    };

    unPublishProductByShop = async (req, res, next) => {
        const resposne = new OK({
            message: 'UnPublish new product successful',
            metadata: await ProductService.unPublishProductByShop({
                product_shop: req.user.userId,
                product_id: req.params.id,
            }),
        });
        ResponseSender.send(res, resposne);
    };

    publishProductByShop = async (req, res, next) => {
        const resposne = new OK({
            message: 'Publish new product successful',
            metadata: await ProductService.publishProductByShop({
                product_shop: req.user.userId,
                product_id: req.params.id,
            }),
        });
        ResponseSender.send(res, resposne);
    };

    getAllDraftsForShop = async (req, res, next) => {
        const resposne = new OK({
            message: 'Create list Draft successful',
            metadata: await ProductService.findAllDraftsForShop({ product_shop: req.user.userId }),
        });
        ResponseSender.send(res, resposne);
    };

    getAllPublishForShop = async (req, res, next) => {
        const resposne = new OK({
            message: 'Create list publish successful',
            metadata: await ProductService.findAllPublishForShop({ product_shop: req.user.userId }),
        });
        ResponseSender.send(res, resposne);
    };
}

const productController = new ProductController();

export default productController;
