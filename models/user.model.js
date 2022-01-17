const mongoose = require('mongoose')
const Schema = mongoose.Schema

// instantiate Schema
const userSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    cart: {

        // nested schema
        items: [{
            productId: { 
                type: Schema.Types.ObjectId,
                required: true,

                // to point out which model is this productId referencing to
                // The model that populate() should use if populating this path.  // we use .populate() in shop.controller.js
                ref: 'Product'  

            },
            quantity: {
                type: Number,
                required: true
            }
        }]
    }
})


/* custom methods */
                                // anonymous function
userSchema.methods.addToCart = function(product) {

    // console.log('.methods.addToCart from user model', product);

    // to see if the item has already been inside the cart
                            // this >>> userSchema we just instantiated
                                            // .findIndex(c => c.id === id) >>> a method returns the index (position) of the first element that passes a test.   
                                            // return -1 if not found
    const cartProductIndex = this.cart.items.findIndex(item => item.productId.toString() === product._id.toString())

    let newQuantity = 1

    const updatedCartItems = [...this.cart.items]    // spread operator  //copy things inside 'this.cart.items'

    if(cartProductIndex >= 0){ // the item has already existed in the cart
        newQuantity = this.cart.items[cartProductIndex].quantity + 1
        updatedCartItems[cartProductIndex].quantity = newQuantity      // to override the new quantity
    }else{
        updatedCartItems.push({
            productId: product._id,
            quantity: newQuantity
        })
    }

    const updatedCart = {
        items: updatedCartItems
    }

    this.cart = updatedCart
    return this.save() 
}

userSchema.methods.removeFromCart = function(productId) {
    const updatedCartItems = this.cart.items.filter(item => 
        // { console.log('item.id from .removeFromCart :',item.id.toString());
        //  console.log('productId.toString() from .removeFromCart:', productId.toString());
        item.id.toString() !== productId.toString()
    )
    console.log('updatedCartItems from removeFromCart in user model: ', updatedCartItems);
    this.cart.items = updatedCartItems
    return this.save()
}

// mongoose.model() >>> to convert the schema to a model
// mongoose.model('collection name(sigular with capitalized letter ', schema) 
module.exports = mongoose.model('User', userSchema)  // 'collection name' will be pluralized in db


