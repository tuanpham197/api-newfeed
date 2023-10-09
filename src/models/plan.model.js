const {Schema, model} = require('mongoose'); // Erase if already required
const { default: slugify } = require('slugify');
const mongoose = require('mongoose')


const DOCUMENT_NAME = 'PLan'
const COLLECTION_NAME = 'PLans'

// Declare the Schema of the Mongo model
const PlanSchema = new Schema({
    plan_name: {type: String, required: true},
    plan_slug: String,
    plan_thumb: {type: String, required: true},
    plan_description: {type: String, required: false},
    plan_quantity: {type: Number, required: false},
    plan_price: {type: Number, required: true},
    plan_type: {type: String, required: true, enum: ['community', 'pro', 'team', 'enterprise']},
    plan_owner: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User' 
    },
    plan_attributes: {type: Schema.Types.Mixed, required: true},

    // more
    plan_rating: {
        default:4.5,
        type: Number,
        min: [1, 'Rating must be above 1.0'],
        max: [5, 'Rating must be above 5.0'],
        set: (val) => Math.round(val * 10) / 10
    },
    plan_variations: {type: Array, default: []},
    isDraft: {type: Boolean, default: true, index: true, select: false},
    isPublished: {type: Boolean, default: false, index: true, select: false}
}, {
    timestamps: true,
    collection: COLLECTION_NAME
});

PlanSchema.index({plan_name: 'text', plan_description: 'text'})

// document middleware : run before .save() and .create()
PlanSchema.pre('save', function (next){
    this.plan_slug = slugify(this.plan_name, {lower: true})
    next()
})


const CommunitySchema = new Schema({
    storage_image: {type: Boolean, require: true, default: false},
    color: {type: String, require: true},
    plan_owner: {type: Schema.Types.ObjectId, ref: 'User'}
}, {
    collation: 'comunities',
    timestamps: true
})

const ProSchema = new Schema({
    key_word: {type: String, require: true},
    field2: {type: String, require: true},
    plan_owner: {type: Schema.Types.ObjectId, ref: 'User'}
}, {
    collation: 'pros',
    timestamps: true
})

//Export the model
module.exports = {
    plan: model(DOCUMENT_NAME, PlanSchema),
    community: model('Comunities', CommunitySchema),
    pro: model('Pros', ProSchema),
};