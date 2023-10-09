'use strict'

const { BadRequestError, NotFoundError } = require("../core/error.response")
const discount = require("../models/discount.model")
const { findAllDiscountCodesUnselect, checkDiscountExists } = require("../models/repositories/discount.repo")
const { findAllPlans } = require("../models/repositories/plan.repo")
const { convertToObjectIdMongoDb } = require("../utils")

/**
 * Discount services
 * 1 - Generate discount code [shop|admin]
 * 2 - Get discount amount [user]
 * 3 - Get all discount codes [user|shop]
 * 4 - Verify discount code [user]
 * 5 - Delete discount code [admin|shop]
 * 6 - Cancel discount code [user]
 */

class DiscountService {
    static async createDiscountCode(payload) {
        const {
            code, start_date, end_date, is_active, userId, min_order_value, plan_ids, applies_to, name, desc,
            type, value, max_uses, uses_count, max_uses_per_user, uses_used, max_value
        } = payload
        // kiem tra
        if (new Date() < new Date(start_date) || new Date() > new Date(end_date)) {
            throw new BadRequestError('Invalid start and end date')
        }

        // create index for discount code
        const foundDiscount = await discount.findOne({
            discount_code: code,
            discount_user_id: convertToObjectIdMongoDb(userId)
        }).lean()

        if (foundDiscount && foundDiscount.discount_is_active) {
            throw new BadRequestError('Discount exists!')
        }

        if (new Date(start_date) >= new Date(end_date)){
            throw new BadRequestError('Start date must be before end_date')
        }

        const newDiscount = await discount.create({
            discount_name: name,
            discount_description: desc,
            discount_type: type,
            discount_value: value,
            discount_code: code,
            discount_start_date: new Date(start_date),
            discount_end_date: new Date(end_date),
            discount_max_use: max_uses,
            discount_max_value: max_value,
            discount_used_count: uses_count,
            discount_users_used: uses_used,
            discount_max_uses_per_user: max_uses_per_user,
            discount_min_order_value: min_order_value || 0,
            discount_user_id: userId,
            discount_is_active: is_active,
            discount_applies_to: applies_to,
            discount_plan_ids: applies_to === 'all' ? [] : plan_ids,
        })

        return newDiscount
    }

    static async update() {

    }

    /**
     * Get all discout codes available with plan
     */

    static async getAllDiscountCodeWithPlan({
        code, userId, customerId, limit, page
    }) {
         // create index for discount code
         const foundDiscount = await discount.findOne({
            discount_code: code,
            discount_user_id: convertToObjectIdMongoDb(userId)
        }).lean()
        
        console.log(`[1]::`, foundDiscount);

        if(!foundDiscount || !foundDiscount.discount_is_active) {
            throw new BadRequestError('Discount not available!')
        }

        const {discount_applies_to, discount_plan_ids} = foundDiscount
        let plans = {}
        if (discount_applies_to === 'all') {
            // get all plan
            plans = await findAllPlans({
                filter: {
                    plan_owner: convertToObjectIdMongoDb(userId),
                    isPublished: true
                },
                limit: +limit,
                page: +page,
                sort: 'ctime',
                select: ['plan_name']
            })
        }

        if (discount_applies_to === 'specific') {
            // get the plan ids
            plans = await findAllPlans({
                filter: {
                    _id: {$in: discount_plan_ids},
                    isPublished: true
                },
                limit: +limit,
                page: +page,
                sort: 'ctime',
                select: ['plan_name']
            })
        }

        return plans
    }

    /**
     * Get all discount code of shop
     */

    static async getAllDiscountCodesByShop({
        limit, page, userId
    }) {
        const discounts = await findAllDiscountCodesUnselect({
            limit: +limit,
            page: +page,
            filter: {
                discount_user_id: convertToObjectIdMongoDb(userId),
                discount_is_active: true
            },
            unSelect: ['__v', 'discount_user_id'],
            model: discount
        })

        return discounts
    }

    /**
     * Apply discount code
     * products = [
     *  {
     *      pplanId,
     *      userId,
     *      quantity,
     *      name,
     *      price
     *  }
     * ]
     */
    static async getDiscountAmount({codeId, customerId, userId, plans}) {
        const foundDiscount = await checkDiscountExists({
            model: discount,
            filter: {
                discount_code: codeId,
                discount_user_id: convertToObjectIdMongoDb(userId)
            }
        })
        if (!foundDiscount) throw new NotFoundError('discount does exists')

        const {
            discount_is_active,
            discount_max_use,
            discount_start_date,
            discount_end_date,
            discount_min_order_value,
            discount_max_uses_per_user,
            discount_users_used,
            discount_type,
            discount_value
        } = foundDiscount

        if (!discount_is_active) throw new NotFoundError('Discount expried!')
        if (!discount_max_use) throw new NotFoundError('Discount are out!')

        if (new Date() < new Date(discount_start_date) || new Date() > new Date(discount_end_date)) {
            throw new NotFoundError('discount code has expried')
        }

        // check xem co gia tri toi thieu ko
        let totalOrder = 0
        if (discount_min_order_value > 0) {
            //get total
            totalOrder = plans.reduce((acc, plan) => {
                return acc + (plan.quantity * plan.price)
            }, 0)
            console.log(`[1]:: TOTAL ::`, plans);
            if (totalOrder < discount_min_order_value) {
                throw new NotFoundError(`discount requires a minimum order value of ${discount_min_order_value}!`)
            }
        }

        if (discount_max_uses_per_user > 0) {
            const userDiscount = discount_users_used.find(user => user.userId === customerId)
            if (userDiscount) {
                // throw new NotFoundError(`discount requires a minimum order value of ${discount_min_order_value}!`)
            }
        }
        
        // check xem discount la fix_amount
        const amount = discount_type === 'fixed_amount' ? discount_value : totalOrder * (discount_value / 100)

        return {
            totalOrder,
            discount: amount,
            totalPrice: totalOrder - amount
        }
    }

    static async deleteDiscountCode({
        userId, codeId
    }) {
        const foundDiscount = ''
        if (foundDiscount) {
            // delete
        }
        const deleted = await discount.findOneAndDelete({
            discount_code: codeId,
            discount_user_id: convertToObjectIdMongoDb(userId)
        })

        return deleted
    }

    static async cancelDiscountCode ({codeId, userId, customerId}) {
        const foundDiscount = await checkDiscountExists({
            model: discount,
            filter: {
                discount_code: codeId,
                discount_user_id: convertToObjectIdMongoDb(userId)
            }
        })
        if (!foundDiscount) throw new NotFoundError('discount code not avai')

        const result = await discount.findByIdAndUpdate(foundDiscount._id, {
            $pull: {
                discount_users_used: customerId,
                $inc: {
                    discount_max_use: 1,
                    discount_used_count: -1
                }
            }
        })

        return result
    }
}

module.exports = DiscountService