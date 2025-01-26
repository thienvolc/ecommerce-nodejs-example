'use strict';

import DiscountService from '../services/access.service.js';
import { OK, CREATED } from '../core/success.response.js';

class DiscountController {
    
    createDiscountCode = async (req, nes, next) => {
        new CREATED({
            message: 'Create code successful',
            metadata: await DiscountService.createDiscountCode({
                ...req.body,
                shopId: req.user.useId,
            }),
        });
    };

    getAllDiscountCodes = async (req, nes, next) => {
        new OK({
            message: 'Get all code successful',
            metadata: await DiscountService.getAllDiscountCodesWithProduct({
                ...req.query,
                shopId: req.user.useId,
            }),
        });
    };

    getAllDiscountCodesByShop = async (req, nes, next) => {
        new OK({
            message: 'Get all code successful',
            metadata: await DiscountService.getAllListDiscountCodesbyShop({
                code: req.params.code,
                shopId: req.user.useId,
            }),
        });
    };

    getDiscountAmout = async (req, nes, next) => {
        new OK({
            message: 'Get amount successful',
            metadata: await DiscountService.getDiscountAmout({
                ...req.body,
            }),
        });
    };

    deleteDiscountCode = async (req, nes, next) => {
        new OK({
            message: 'Delete code successful',
            metadata: await DiscountService.getAllDiscountCodesWithProduct({
                codeId: req.body.codeId,
                shopId: req.user.useId,
            }),
        });
    };

    cancelDiscountCode = async (req, nes, next) => {
        new OK({
            message: 'Cancel code successful',
            metadata: await DiscountService.cancelDiscountCode({
                codeId: req.body.codeId,
                shopId: req.user.useId,
            }),
        });
    };
}
