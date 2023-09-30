'use strict'

const {Schema, model} = require('mongoose'); // Erase if already required

const DOCUMENT_NAME = 'Key'
const COLLECTION_NAME = 'Keys'

// Declare the Schema of the Mongo model
var keyTokenSchema = new Schema({
    user:{
        type: Schema.Types.ObjectId,
        required:true,
        ref: 'users',
    },
    publicKey:{
        type:String,
        required:true,
    },
    refreshToken: {
        type: Array,
        default: [],
    }
}, {
    collection: COLLECTION_NAME,
    timeseries: true
});

//Export the model
module.exports = model(DOCUMENT_NAME, keyTokenSchema);