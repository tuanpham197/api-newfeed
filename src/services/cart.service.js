'use strict'

const {cart} = require("../models/cart.model")
const { getPlanById } = require("../models/repositories/plan.repo")
const { NotFoundError } = require('../core/error.response')

/**
 * Key feature: Cart service
 * -add product to cart [user]
 * - reduce product quantity by one [user]
 * - increase product quantity by one [user]
 * - get cart [user]
 * - delete cart [user]
 * - delete cart item
 */
class CartService {

    static async createCustomerCart({customerId, plan}) {
        const query = {cart_customerId: customerId, cart_state: 'active'},
        updateOrInsert = {
            $addToSet: {
                cart_plans: plan
            }
        }, options = {upsert: true, new: true}

        return await cart.findOneAndUpdate(query, updateOrInsert, options)
    }

    static async updateCustomerCartQuantity({customerId, plan}) {
        const { planId, quantity } = plan
        const query = {
            cart_customerId: customerId,
            'cart_plans.planId': planId,
            cart_state: 'active'
        }, updateSet = {
            $inc: {
                'cart_plans.$.quantity': quantity
            }
        }, options = {upsert: true, new: true}
        console.log(`[2]:: query :: `, query);
        console.log(`[2]:: updateSet :: `, updateSet);
        console.log(`[2]:: options :: `, options);

        return await cart.findOneAndUpdate(query, updateSet, options)
    }

    static async addToCart({customerId, plan = {}}) {
        // check cart ton tai hay ko
        const customerCart = await cart.findOne({
            cart_customerId: customerId
        })
        if (!customerCart) {
            //create new
            return CartService.createCustomerCart({customerId, plan})
        }

        // Neu co gio hang nhung chua co san pham
        if (customerCart.cart_plans.length) {
            customerCart.cart_plans = [plan]
            return await customerCart.save()
        }

        // gio hang ton tai va co san pham thi update quantity
        return await CartService.updateCustomerCartQuantity({customerId, plan})
    }

    // update
    /*
        owner_order_ids: [
            {
                ownerId,
                item_plans: [
                    quantity, price, ownerId, old_quantiry, plan_id
                ],
                version
            }
        ]
    */
    static async addToCartv2({customerId, owner_order_ids = {}}) {
        const {planId, quantity, old_quantity} = owner_order_ids[0]?.item_plans[0]
        // check plan
        const foundCart = await getPlanById(planId)
        if (!foundCart) throw new NotFoundError('error')
        console.log(`[1]:: foundCart :: `, foundCart);
        if(foundCart.plan_owner.toString() !== owner_order_ids[0]?.userId) {
            if (!foundCart) throw new NotFoundError('product not belong to owner')
        }
        
        if(quantity === 0) {
            // delete
        }
        return await CartService.updateCustomerCartQuantity({
            customerId,
            plan: {
                planId,
                quantity: quantity - old_quantity
            }
        })
    }

    static async deleteCustomerCart({customerId, planId}) {
        const query = {cart_customerId: customerId, cart_state: 'active'},
        updateSet = {
            $pull: {
                cart_plans: {
                    planId
                }
            }
        }
        const deleteCart = await cart.updateOne(query, updateSet)
        return deleteCart
    }

    static async getListCustomerCart({customerId}) {
        return await cart.findOne({cart_customerId: +customerId}).lean()
    }
}

module.exports = CartService