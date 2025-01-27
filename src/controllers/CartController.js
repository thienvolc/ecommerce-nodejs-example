import CartService from '../services/CartService.js';
import { ResponseSender, CREATED, OK } from '../utils/responses/index.js';
import { asyncErrorDecorator } from '../helpers/asyncErrorWrapper.js';

class CartController {
    // [POST] /cart
    static createUserCart = async (req, res, next) => {
        const metadata = await CartService.createUserCart(req.body);

        const response = new CREATED({ message: 'Create new cart successful', metadata });
        ResponseSender.send(res, response);
    };

    // [GET] /cart
    static getUserCartList = async (req, res, next) => {
        const metadata = await CartService.getUserCartList(req.query);

        const response = new OK({ message: 'Get carts list successful', metadata });
        ResponseSender.send(res, response);
    };

    // [PATCH] /cart
    static updateUserCartQuantity = async (req, res, next) => {
        const metadata = await CartService.updateUserCartQuantity(req.body);

        const response = new OK({ message: 'Update cart quantity successful', metadata });
        ResponseSender.send(res, response);
    };

    // [DELETE] /cart
    static deleteUserCart = async (req, res, next) => {
        const metadata = await CartService.deleteUserCart(req.body);

        const response = new OK({ message: 'Delete cart successful', metadata });
        ResponseSender.send(res, response);
    };
}

export default asyncErrorDecorator(CartController);
