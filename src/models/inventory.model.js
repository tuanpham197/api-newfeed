'use strict'

const {Schema, model, Types} = require('mongoose'); // Erase if already required

const DOCUMENT_NAME = 'Inventory'
const COLLECTION_NAME = 'Inventories'

// Declare the Schema of the Mongo model
var inventorySchema = new Schema({
    inven_productId:{
        type: Types.ObjectId,
        ref: 'Plan',
    },
    inven_location:{
        type: String,
        default: 'unKnow',
    },
    inven_stock: {
        type: Number,
        required:true,
    },
    inven_shopId: {
        type: Types.ObjectId,
        ref: 'User',
    },
    inven_reservations: {
        type: Array,
        default: []
    }
}, {
    collection: COLLECTION_NAME,
    timeseries: true
});

//Export the model
module.exports = {
    inventory: model(DOCUMENT_NAME, inventorySchema)
}