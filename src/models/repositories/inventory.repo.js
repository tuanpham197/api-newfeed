const { convertToObjectIdMongoDb } = require("../../utils")
const { inventory } = require("../inventory.model")
const {Types} = require('mongoose')

const insertInventory = async ({
    planId, userId, stock, location = 'unKnow'
}) => {
    return await inventory.create({
        inven_productId: planId,
        inven_shopId: userId,
        inven_location: location,
        inven_stock: stock,
    })
}

const reservationInventory = async ({planId, quantity, cartId}) => {
    const query = {
        inven_productId: convertToObjectIdMongoDb(planId),
        inven_stock: {$gte: quantity}
    }, updateSet = {
        $inc: {
            inven_stock: -quantity
        },
        $push: {
            inven_reservations: {
                quantity,
                cartId,
                createAt: new Date()
            }
        }
    }, options = { upsert: true, new: true}

    return await inventory.updateOne(query, updateSet)
}

module.exports = {
    insertInventory,
    reservationInventory
}