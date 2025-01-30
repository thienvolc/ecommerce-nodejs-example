import ShopService from '../services/ShopService.js';
import { ResponseSender, CREATED, OK } from '../utils/responses/index.js';
import { asyncErrorDecorator } from '../helpers/asyncErrorWrapper.js';

class ShopController {
    // [POST] /shop
    static createShop = async (req, res, next) => {
        const shopData = {
            ...req.body,
            shop_ownerId: req.user._id,
        };
        const metadata = await ShopService.createShop(shopData);
        const response = new CREATED({ message: 'Shop created successfully', metadata });
        ResponseSender.send(res, response);
    };

    // [PATCH] /shop/:id
    static updateShop = async (req, res, next) => {
        const shopData = {
            ...req.body,
            shop_id: req.params.id,
            shop_ownerId: req.user._id,
        };
        const metadata = await ShopService.updateShop(shopData);
        const response = new OK({ message: 'Shop updated successfully', metadata });
        ResponseSender.send(res, response);
    };

    // [GET] /shop/:id
    static getShopById = async (req, res, next) => {
        const shopId = req.params.id;
        const metadata = await ShopService.getShopById(shopId);
        const response = new OK({ message: 'Shop retrieved successfully', metadata });
        ResponseSender.send(res, response);
    };

    // [GET] /shop
    static getAllShops = async (req, res, next) => {
        const metadata = await ShopService.getAllShops(req.query);
        const response = new OK({ message: 'All shops retrieved successfully', metadata });
        ResponseSender.send(res, response);
    };

    // [GET] /shop/search/:search
    static searchShops = async (req, res, next) => {
        const metadata = await ShopService.searchShops(req.query);
        const response = new OK({ message: 'Shops search successful', metadata });
        ResponseSender.send(res, response);
    };

    // [POST] /shop/unpublish/:id
    static unpublishShop = async (req, res, next) => {
        const body = {
            shop_ownerId: req.user._id,
            _id: req.params.id,
        };
        const metadata = await ShopService.unPublishShopByUser(body);
        const response = new OK({ message: 'Shop unpublished successfully', metadata });
        ResponseSender.send(res, response);
    };
}

export default asyncErrorDecorator.decorateAllStaticMethods(ShopController);
