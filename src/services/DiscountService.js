import { BadRequestError, NotFoundError } from '../utils/responses/index.js';
import { DiscountRepository, ProductBaseRepository } from '../repositories/index.js';

export default class DiscountService {
    static #discountRepository = DiscountRepository;
    static #productBaseRepository = ProductBaseRepository;

    static createDiscountCode = async (body) => {
        const { discount_code, discount_shopId } = body;
        const existingDiscount = await this.#discountRepository.findByCodeAndShopId({
            code: discount_code,
            shopId: discount_shopId,
        });

        if (existingDiscount?.discount_is_active) throw new BadRequestError('Discount code already exists');

        return await this.#discountRepository.create(body);
    };

    static validateDiscountCode = async ({ code, shopId }) => {
        const discount = await this.#discountRepository.findByCodeAndShopId({ code, shopId });
        if (!discount?.discount_is_active) throw new BadRequestError('Discount does not exists');

        if (discount.discount_max_uses <= 0) throw new BadRequestError('Discount are out');

        return discount;
    };

    static getAllAppliedProductsByCode = async ({ code, shopId, limit, page }) => {
        const { discount_applies_to, discount_product_ids } = await this.validateDiscountCode({ code, shopId });
        const filter = {
            isPublished: true,
            ...(discount_applies_to !== 'all' ? { _id: { $in: discount_product_ids } } : { product_shopId: shopId }),
        };

        return await this.#productBaseRepository.findAllProducts({
            filter,
            limit: +limit,
            page: +page,
            sort: 'ctime',
            select: ['product_name'],
        });
    };

    static getAllDiscountCodesbyShop = async ({ shopId, limit, page }) => {
        return await this.#productBaseRepository.findAllProducts({
            filter: {
                discount_shopId: shopId,
                discount_is_active: true,
            },
            page: +page,
            limit: +limit,
            unSelect: ['__v', 'discount_shopId'],
        });
    };

    static getDiscountAmount = async ({ codeId, userId, shopId, products }) => {
        const discount = await this.validateDiscountCode({ code: codeId, shopId });
        const totalOrder = await this.checkDiscountAvailability(discount, userId, products);
        const discountAmount = this.calculateDiscountAmount(
            discount.discount_type,
            discount.discount_value,
            totalOrder,
        );

        return {
            totalOrder,
            discount: discountAmount,
            totalPrice: totalOrder - discountAmount,
        };
    };

    static async checkDiscountAvailability(discount, userId, products) {
        let totalOrder = this.calculateOrderPrice(products);
        this.checkMinimumOrderValue(discount, totalOrder);
        if (discount.discount_min_value > 0) this.checkUserUsageLimit(discount, userId);

        return totalOrder;
    }

    static calculateOrderPrice = (products) => products.reduce((acc, p) => acc + p.quantity * p.price, 0);

    static checkMinimumOrderValue = (discount, totalOrder) => {
        const { discount_min_order_value, discount_min_value } = discount;
        if (discount_min_value > 0 && totalOrder < discount_min_order_value)
            throw new NotFoundError(`Minimum order value required: ${discount_min_order_value}`);
    };

    static checkUserUsageLimit = (discount, userId) => {
        const { discount_max_uses_per_user, discount_users_used } = discount;
        const userUsage = discount_users_used.find((user) => user.userId === userId);
        if (userUsage?.count >= discount_max_uses_per_user)
            throw new NotFoundError('User has exceeded discount usage limit');
    };

    static calculateDiscountAmount = async (discountType, discountValue, totalOrder) =>
        discountType === 'fixed_amount' ? discountValue : totalOrder * (discountValue / 100);

    static async deleteDiscountCode({ shopId, code }) {
        return await this.#discountRepository.findOneAndDelete({
            discount_shopId: shopId,
            discount_code: code,
        });
    }

    static cancelDiscountCode = async ({ shopId, userId, code }) => {
        const discount = await this.validateDiscountCode({ code, shopId });
        return this.#discountRepository.updateOne(
            { _id: discount._id },
            {
                $pull: { discount_users_used: userId },
                $inc: { discount_uses_count: -1, discount_max_uses: 1 },
            },
        );
    };
}
