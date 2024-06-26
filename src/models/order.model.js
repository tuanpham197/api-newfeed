'use strict'

const {Schema, model} = require('mongoose'); // Erase if already required

const DOCUMENT_NAME = 'Order'
const COLLECTION_NAME = 'orders'

// Declare the Schema of the Mongo model
var orderSchema = new Schema({
    order_customerId: {type: Number, required: true},
    order_checkout: {
        type: Object,
        default: {}
    },
    /*
        order_checkout = {
            totalPrice,
            totalApplyDiscount,
            feeShip
        }
    */
    order_shipping: {type: Object, default: {}},
    /**
     * street
     * city
     * state
     * country
     */
    order_payment: {type: Object, default: {}},
    order_plans: {type: Array, required: true},
    order_trackingNumber: {type: String, default: ""},
    order_status: {type: String, enum: ['pending', 'confirmed', 'shipped', 'cancelled' , 'delivered'], default: 'pending'},
}, {
    collection: COLLECTION_NAME,
    timestamps: true
});

//Export the model
module.exports = {
    order: model(DOCUMENT_NAME, orderSchema)
}