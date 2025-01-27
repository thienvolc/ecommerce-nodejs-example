'use strict';

import { BadRequestError, NotFoundError } from '../core/error.response.js';
import discountModel from '../models/discount.model.js';
import { findAllDiscountCodesUnSelect, findDiscount } from '../models/repositories/discount.repo.js';
import { findAllProducts } from '../models/repositories/product.repo.js';

/**
 * Discount services
 * 1 - Generator discount code [shop | admin]
 * 2 - get discount amoun [user]
 * 3- get all discount codes [user]
 * 4 - verify discount code [user]
 * 5- delete discount code [admin, shop]
 * 6- cancel discount code [user]
 */

export default class DiscountService {
    static async createDiscountCode(body) {
        const {
            code,
            start_date,
            end_date,
            is_active,
            shopId,
            min_order_value,
            product_ids,
            applies_to,
            name,
            desc,
            type,
            max_value,
            max_uses,
            uses_count,
            max_uses_per_user,
        } = body;
        if (
            new Date() > new Date(start_date) ||
            new Date() > new Date(end_date) ||
            new Date(end_date) <= new Date(start_date)
        )
            throw new BadRequestError('Invalid date');

        const foundDiscount = await findDiscount({ discount_code: code, discount_shopId: shopId });

        if (foundDiscount && foundDiscount.discount_is_active) throw new BadRequestError('Discount exists');

        const newDiscount = await discountModel.create({
            discount_name: name,
            discount_desc: desc,
            discount_type: type,
            discount_value: value,
            discount_code: code,
            discount_start_date: new Date(start_date),
            discount_end_date: new Date(end_date),
            discount_max_uses: max_uses,
            discount_uses_count: uses_count,
            discount_users_used: users_used,
            discount_max_uses_per_user: max_uses_per_user,
            discount_min_order_value: min_order_value || 0,
            discount_shopId: shopId,
            discount_is_active: is_active,
            discount_applies_to: applies_to,
            discount_product_ids: applies_to === 'all' ? [] : product_ids,
        });
        return newDiscount;
    }

    static async updateDiscountCode() {}

    static async getAllDiscountCodesWithProduct({ code, shopId, limit, page }) {
        const foundDiscount = await discountModel.findOne({ discount_code: code, discount_shopId: shopId }).lean();

        if (!foundDiscount || !foundDiscount.discount_is_active) throw new NotFoundError('Discount does not exist');

        let products;
        const { discount_applies_to, discount_product_ids } = foundDiscount;
        if (discount_applies_to === 'all') {
            products = await findAllProducts({
                filter: { product_shop: shopId, isPublished: true },
                limit: +limit,
                page: +page,
                sort: 'ctime',
                select: ['product_name'],
            });
        } else {
            products = await findAllProducts({
                filter: {
                    _id: { $in: discount_product_ids },
                    isPublished: true,
                },
                limit: +limit,
                page: +page,
                sort: 'ctime',
                select: ['product_name'],
            });
        }

        return products;
    }

    static async getAllDiscountCodesbyShop({ limit, page, shopId }) {
        const discounts = await findAllDiscountCodesUnSelect({
            limit: +limit,
            page: +page,
            filter: {
                discount_shopId: shopId,
                discount_is_active: true,
            },
            unSelect: ['__v', 'discount_shopId'],
            model: discountModel,
        });
        return discounts;
    }

    static async getDiscountAmout({ codeId, userId, shopId, products }) {
        const foundDiscount = await findDiscount({ discount_code: codeId, discount_shopId: shopId });
        if (!foundDiscount) throw new NotFoundError('Discount does not exits');
        const {
            discount_is_active,
            discount_max_uses,
            discount_start_date,
            discount_end_date,
            discount_min_order_value,
            discount_min_value,
            discount_users_used,
            discount_max_uses_per_user,
            discount_value,
        } = foundDiscount;

        if (
            !discount_is_active ||
            new Date() < new Date(discount_start_date) ||
            new Date() > new Date(discount_end_date)
        )
            throw new NotFoundError('Discount expired');
        if (!discount_max_uses) throw new NotFoundError('Discount are out');

        let totalOrder = 0;
        if (discount_min_value > 0) {
            totalOrder = products.reduce((acc, p) => {
                return acc + p.quantity * p.price;
            }, 0);
            if (totalOrder < discount_min_order_value)
                throw new NotFoundError(`Discount requires a minimum order value of ${discount_min_order_value}`);
        }

        if (discount_max_uses_per_user > 0) {
            const countUsesOfUser = discount_users_used.find((user) => user.userId === userId);
            if (countUsesOfUser) {
            }
        }

        // check typeof is fixed or percentage discount
        const amount = discount_type === 'fixed_amount' ? discount_value : totalOrder * (discount_value / 100);
        return {
            totalOrder,
            discount: amount,
            totalPrice: totalOrder - discount,
        };
    }

    static async deleteDiscountCode({ shopId, codeId }) {
        const deletedCode = await discountModel.findOneAndDelete({
            discount_shopId: shopId,
            discount_code: codeId,
        });

        return deletedCode;
    }

    static async cancelDiscountCode({ shopId, userId, codeId }) {
        const foundDiscount = await checkDiscountExists({
            model: discountModel,
            filter: {
                discount_code: codeId,
                discount_shopId: shopId,
            },
        });
        if (!foundDiscount) throw new NotFoundError('Code does not exists');

        const result = await discountModel.findByIdAndUpdate(foundDiscount._id, {
            $pull: {
                discount_users_used: userId,
            },
            $inc: {
                discount_uses_count: -1,
                discount_max_uses: 1,
            },
        });

        return result;
    }
}
