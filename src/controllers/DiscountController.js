import DiscountService from '../services/DiscountService.js';
import { ResponseSender, CREATED, OK } from '../utils/responses/index.js';
import { asyncErrorDecorator } from '../helpers/asyncErrorWrapper.js';

class DiscountController {
    // [POST] /discount
    static createDiscountCode = async (req, res, next) => {
        const body = {
            ...req.body,
            ownerId: req.user.userId,
        };
        const discount = await DiscountService.createDiscountCode(body);

        const response = new CREATED({ message: 'Discount code created successfully', metadata: discount });
        ResponseSender.send(res, response);
    };

    // [GET] /discount?code=&limit=&page=
    static getAllDiscountCodes = async (req, res, next) => {
        const body = {
            ...req.query,
            discount_shopId: req.user.shopId,
        };
        const discounts = await DiscountService.getAllDiscountCodesbyShop(body);

        const response = new OK({ message: 'Fetched all discount codes successfully', metadata: discounts });
        ResponseSender.send(res, response);
    };

    // [GET] /discount/products?code=&limit=&page=
    static getAllAppliedProductsByCode = async (req, res, next) => {
        const body = {
            ...req.query,
            discount_shopId: req.user.shopId,
        };
        const products = await DiscountService.getAllAppliedProductsByCode(body);

        const response = new OK({ message: 'Fetched all discount codes by shop successfully', metadata: products });
        ResponseSender.send(res, response);
    };

    // [POST] /discount/amount
    static getDiscountAmount = async (req, res, next) => {
        const computedOrder = await DiscountService.getDiscountAmount(req.body);

        const response = new OK({ message: 'Calculated discount amount successfully', metadata: computedOrder });
        ResponseSender.send(res, response);
    };

    // [DELETE] /discount
    static deleteDiscountCode = async (req, res, next) => {
        const body = {
            code: req.body.code,
            shopId: req.user.shopId,
        };
        const deletedDiscount = await DiscountService.deleteDiscountCode(body);

        const response = new OK({ message: 'Deleted discount code successfully', metadata: deletedDiscount });
        ResponseSender.send(res, response);
    };

    // [PUT] /discount/cancel
    static cancelDiscountCode = async (req, res, next) => {
        const canceledDiscount = await DiscountService.cancelDiscountCode({
            code: req.body.code,
            shopId: req.user.shopId,
            userId: req.user.userId,
        });

        const response = new OK({ message: 'Canceled discount code successfully', metadata: canceledDiscount });
        ResponseSender.send(res, response);
    };
}

export default asyncErrorDecorator.decorateAllStaticMethods(DiscountController);
