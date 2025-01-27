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
        const metadata = await DiscountService.createDiscountCode(body);

        const response = new CREATED({ message: 'Discount code created successfully', metadata });
        ResponseSender.send(res, response);
    };

    // [GET] /discount
    static getAllDiscountCodes = async (req, res, next) => {
        const body = {
            ...req.query,
            ownerId: req.user.userId,
        };
        const metadata = await DiscountService.getAllDiscountCodesWithProduct(body);

        const response = new OK({ message: 'Fetched all discount codes successfully', metadata });
        ResponseSender.send(res, response);
    };

    // [GET] /discount/shop/:code
    static getDiscountCodesByShop = async (req, res, next) => {
        const body = {
            ...req.query,
            ownerId: req.user.userId,
        };
        const metadata = await DiscountService.getAllListDiscountCodesByShop(body);

        const response = new OK({ message: 'Fetched all discount codes by shop successfully', metadata });
        ResponseSender.send(res, response);
    };

    // [POST] /discount/amount
    static calculateDiscountAmount = async (req, res, next) => {
        const metadata = await DiscountService.getDiscountAmount(req.body);

        const response = new OK({ message: 'Calculated discount amount successfully', metadata });
        ResponseSender.send(res, response);
    };

    // [DELETE] /discount
    static deleteDiscountCode = async (req, res, next) => {
        const body = {
            codeId: req.body.codeId,
            ownerId: req.user.userId,
        };
        const metadata = await DiscountService.deleteDiscountCode(body);

        const response = new OK({ message: 'Deleted discount code successfully', metadata });
        ResponseSender.send(res, response);
    };

    // [PUT] /discount/cancel
    static cancelDiscountCode = async (req, res, next) => {
        const metadata = await DiscountService.cancelDiscountCode({
            codeId: req.body.codeId,
            ownerId: req.user.userId,
        });

        const response = new OK({ message: 'Canceled discount code successfully', metadata });
        ResponseSender.send(res, response);
    };
}

export default asyncErrorDecorator(DiscountController);
