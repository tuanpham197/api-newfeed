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

module.exports = {
    insertInventory
}