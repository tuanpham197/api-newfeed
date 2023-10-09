'use strict'

const {Schema, model} = require('mongoose'); // Erase if already required

const DOCUMENT_NAME = 'Cart'
const COLLECTION_NAME = 'carts'

// Declare the Schema of the Mongo model
var cartSchema = new Schema({
    cart_state:{
        type: String,
        required:true,
        unum: ['active','complete','fail', 'pending'],
        default: 'active'
    },
    cart_plans: {type: Array, require: true, default: []},
    /**
     * [
     *      {
     *          planId,
     *          userId,
     *          quantity,
     *          name:
     *          price:
     *      }
     * ]
     */
    cart_count_plan: {type: Number, default: 0},
    cart_customerId: {type: Number, required: true}
  
}, {
    collection: COLLECTION_NAME,
    timeseries: {
        createdAt: 'createdOn',
        updatedAt: 'modifiedOn',
    }
});

//Export the model
module.exports = {
    cart: model(DOCUMENT_NAME, cartSchema)
}