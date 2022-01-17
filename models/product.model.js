const mongoose = require('mongoose')
const Schema = mongoose.Schema

const productSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    userId:{
        type: Schema.Types.ObjectId,
        required: true,
        ref:'User'   // to point out which model is this productId referencing to

    }
})

// mongoose.model() >>> to convert the schema to a model
// mongoose.model('collection name(sigular with capitalized letter ', schema) 
module.exports = mongoose.model('Product', productSchema)    // 'collection name' will be pluralized in db