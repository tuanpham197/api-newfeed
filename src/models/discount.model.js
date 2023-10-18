'use strict'

const {Schema, model} = require('mongoose'); // Erase if already required

const DOCUMENT_NAME = 'Discount'
const COLLECTION_NAME = 'discounts'

// Declare the Schema of the Mongo model
var discountSchema = new Schema({
    discount_name:{
        type: String,
        required:true,
    },
    discount_description:{
        type: String,
        default: true,
    },
    discount_type: {
        type: String,
        default: 'fixed_amount' // percentage
    },
    discount_value: {type: Number, required: true},
    discount_code: {type: String, required: true},
    discount_start_date: {type: Date, required: true},
    discount_end_date: {type: Date, required: true},
    discount_max_use: {type: Number, required: true},
    discount_max_value: {type: Number, required: true},
    discount_used_count: {type: Number, required: true},
    discount_users_used: {type: Array, default: []},
    discount_max_uses_per_user: {type: Number, required: true},
    discount_min_order_value: {type: Number, required: true},
    discount_user_id: {type: Schema.ObjectId, ref: 'User'},
    discount_is_active: {type: Boolean, default: true},
    discount_applies_to: {type: String, required: true, enum:['all','specific']},
    discount_plan_ids: {type: Array, default: []},
}, {
    collection: COLLECTION_NAME,
    timeseries: true
});

//Export the model
module.exports = model(DOCUMENT_NAME, discountSchema);