const {Schema, model} = require('mongoose'); // Erase if already required

const DOCUMENT_NAME = 'User'
const COLLECTION_NAME = 'Users'
// Declare the Schema of the Mongo model
const userSchema = new Schema({
    name:{
        type:String,
        required:true,
        unique:true,
        maxLength: 55,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    status:{
        type: String,
        required:true,
        enum: ['active', 'inactive'],
        default: 'inactive',
    },
    password:{
        type:String,
        required:true,
    },
    verify: {
        type: Schema.Types.Boolean,
        default: false,
    },
    roles: {
        type: Array,
        default: []
    }
}, {
    timestamps: true,
    collection: COLLECTION_NAME
});

//Export the model
module.exports = {
    user: model(DOCUMENT_NAME, userSchema),
}