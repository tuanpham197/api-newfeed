'use strict'

const { BadRequestError } = require("../core/error.response")
const { findCartById } = require("../models/repositories/cart.repo")
const { checkPlanByServer } = require("../models/repositories/plan.repo")
const { getDiscountAmount } = require("./discount.service")
const { acquireLock, releaseLock } = require("./redis.service")

const { order } = require('../models/order.model')

class CheckoutService {
    /*
        {
            carId,
            customerId,
            owner_order_ids: [
                {
                    userId,
                    user_discount: [],
                    item_products: {
                        {
                            price,
                            quantity,
                            planId
                        }
                    }
                },
                {
                    userId,
                    user_discount: [
                        {
                            userId,
                            discountId,
                            codeId
                        }
                    ],
                    item_products: {
                        {
                            price,
                            quantity,
                            planId
                        }
                    }
                }
            ]
        }
    */
    static async checkoutReview({
        cartId, customerId, owner_order_ids
    }) {
        // check carId ton tai hay khong
        const foundCart = await findCartById(cartId)
        if(!foundCart) throw new BadRequestError('cart does not exists')

        const checkoutOrder = {
            totalPrice: 0, // tong tien hang
            freeShip: 0,
            totalDiscount: 0, // tong tien giam gia
            totalCheckout: 0
        }, owner_order_ids_new = []
        
        // tinh tong tien bill
        for (let i=0; i< owner_order_ids.length;i++) {
            const { userId, user_discount = [], item_plans = [] } = owner_order_ids[i]

            // check plan available
            const checkPlanServer = await checkPlanByServer(item_plans)
            console.log(`checkPlanServer::`, checkPlanServer)
            if (!checkPlanServer[0]) throw new BadRequestError('order wrong!!')

            // tong tien don hang
            const checkoutPrice = checkPlanServer.reduce((acc, plan) => {
                return acc + (plan.quantity * plan.price)
            }, 0)

            // tong tien truoc khi xu
            checkoutOrder.totalPrice += checkoutPrice

            const itemCheckout = {
                userId,
                user_discount,
                priceRaw: checkoutPrice, // truoc khi giam gia
                priceApplyDiscount: checkoutPrice,
                item_plans: checkPlanServer
            }

            // neu user_discount ton tai > 0, check xem co hop le hay khong
            if (user_discount.length > 0) {
                const {totalPrice = 0, discount = 0} = await getDiscountAmount({
                    codeId: user_discount[0].codeId,
                    customerId,
                    userId,
                    plans: checkPlanServer
                })

                // tong discount giam gia
                checkoutOrder.totalDiscount += discount
                if (discount > 0) {
                    itemCheckout.priceApplyDiscount = checkoutPrice - discount
                }
            }

            // tong thanh toan cuoi cung
            checkoutOrder.totalCheckout+= itemCheckout.priceApplyDiscount
            owner_order_ids_new.push(itemCheckout)
        }

        return {
            owner_order_ids,
            owner_order_ids_new,
            checkoutOrder
        }
    }

    static async orderByUser({
        owner_order_ids,
        cartId,
        customerId,
        customer_address = {},
        customer_payment = {}
    }) {
        const { owner_order_ids_new, checkout_order } = await CheckoutService.checkoutReview({
            cartId,
            customerId,
            owner_order_ids
        })

        // check lai quantiy plan over in inventory
        const plans = owner_order_ids_new.flatMap(order => order.item_plans)
        console.log(`[1]::`, plans);
        const acquirePlan = []
        for (let i = 0; i< plans.length; i++) {
            const { planId, quantity } = plans[i]
            const keyLock = await acquireLock(planId, quantity, cartId)
            acquirePlan.push(keyLock ? true : false)
            if (keyLock) {
                await releaseLock(keyLock)
            }
        }
        // check if have plan out of stock in inventory
        if (acquirePlan.includes(false)) {
            throw new BadRequestError(' Mot so san pham da duoc cap nhat , vui long check lai gio hang')
        }

        // tao order
        const newOrder = await order.create({
            order_customerId: customerId,
            order_checkout: checkout_order,
            order_shipping: customer_address,
            order_payment: customer_payment,
            order_plans: owner_order_ids_new
        })

        // TH: new create thanh cong, thi remove plan in cart
        if (newOrder) {
            // remove plan in cart

        }

        return newOrder
    }

    /**
     * 1. Query order [customer]
     */
    static async getOrderByCustomer() {

    }

    /**
     * 2. Query order using ID [user]
     */
    static async getOneOrderByCustomer() {
        
    }

    /**
     * 3. cancel order [customer]
     */
    static async cancelOrderByCustomer() {
        
    }

    /**
     * 4. Update order status [user|admin]
     */
    static async updateOrderStatusByShop() {
        
    }
}

module.exports = CheckoutService