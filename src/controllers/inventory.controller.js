'use strict'

const InventoryService = require("../services/inventory.service");
const { SuccessResponse} = require('../core/sucess.response');

class InventoryController {
    addStockToInventory = async (req, res, next) => {
        new SuccessResponse({
            message: 'Success :: addStockToInventory',
            metadata: await InventoryService.addStockToInventory(req.body),
            statusCode: 200
        }).send(res)
    }

}

module.exports = new InventoryController()