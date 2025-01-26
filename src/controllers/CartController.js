import CartService from '../services/CartService.js';
import { OK, CREATED } from '../core/success.response.js';
import { ResponseSender, CREATED, OK } from '../utils/responses/index.js';

export default class CartController {
    createUserCart = async (req, res, next) => {
        const response = new CREATED({
            message: 'Create new cart successful',
            metadata: await CartService.createUserCart(req.body),
        });
        ResponseSender.send(res, response);
    };

    updateUserCartQuantity = async (req, res, next) => {
        const response = new OK({
            message: 'Update cart quantity successful',
            metadate: await CartService.updateUserCartQuantity(req.body),
        });
        ResponseSender.send(res, response);
    };

    deleteUserCart = async (req, res, next) => {
        const response = new OK({
            message: 'Delete cart successful',
            metadate: await CartService.deleteUserCart(req.body),
        }).send(res);
        ResponseSender.send(res, response);
    };

    getUserCartList = async (req, res, next) => {
        const response = new OK({
            message: 'Get carts list successful',
            metadate: await CartService.getUserCartList(req.query),
        }).send(res);
        ResponseSender.send(res, response);
    };
}
