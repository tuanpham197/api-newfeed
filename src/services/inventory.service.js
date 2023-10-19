'use strict'

const { BadRequestError } = require('../core/error.response')
const {
    inventory
} = require('../models/inventory.model')
const { getPlanById } = require('../models/repositories/plan.repo')

class InventoryService {
    static async addStockToInventory({
        stock,
        planId,
        userId,
        location = 'test locatin'
    }) {
        const plan = await getPlanById(planId)
        if(!plan) throw new BadRequestError(' The plan not exists')

        const query = { inven_shopId: userId, inven_productId: planId },
        updateSet = {
            $inc: {
                inven_stock: stock
            },
            $set: {
                inven_location: location
            }
        }, options = { upsert: true, new: true}
        
        return await inventory.findOneAndUpdate(query, updateSet, options)
    }

}

module.exports = InventoryService