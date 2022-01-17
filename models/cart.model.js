const fs = require('fs')
const path = require('path')

const cartPath = path.join(path.dirname(process.mainModule.filename), 'data', 'cart.json')
//console.log('cartPath',cartPath);
//console.log(path.dirname(process.mainModule.filename));

module.exports = class Cart{

    static getCart(callback){ // to fire callback as long as there is no error
        fs.readFile(cartPath, (err, content)=>{
            const cart = JSON.parse(content)  // pasrse json file to js obj
            console.log('cart model: ',cart)

            if(err){
                console.log(err)
                callback(null)
            }else{
                callback(cart)
            }
        })
    }

    static addProduct(id, price){
        fs.readFile(cartPath, (err, content)=>{
            let cart
            /*
            let cart ={
                "products": [
                    
                ],
                "totalPrice": 0
            }
            */

            if(!err){
                cart = JSON.parse(content)  // pasrse json file to js obj
                //console.log(cart);

            }
            
            // .findIndex(c => c.id === id) >>> a method returns the index (position) of the first element that passes a test.   
            // return -1 if not found
            const existingProductIndex = cart.products.findIndex(c => c.id === id) 
            const existingProduct = cart.products[existingProductIndex] // cart.products[-1] >>> undefinded

            let updatedProduct

            if (existingProduct){ // to add the quantitiy by 1
                updatedProduct = {...existingProduct}   // copy all the properties of the existingProduct
                updatedProduct.quantity = updatedProduct.quantity+1  // revise the quantity property of it  //updatedProduct.quantity++ 

                cart.products=[...cart.products] // spreading out the cart with updated one
                cart.products[existingProductIndex] = updatedProduct  // replace this product with what we just updated
            }else{ // there is no existingProduct in the cart right now
                updatedProduct = { id, quantity:1 }  // create an object for the item we first add into cart
                cart.products = [...cart.products, updatedProduct]
            
            }

            cart.totalPrice = cart.totalPrice +  parseInt(price)
            
            // .writeFile() >>> will override data if the file has been existed 
            // .writeFile() >>> async
            //.stringify() >>> Converts a JavaScript value to a JavaScript Object Notation (JSON) string.
            // fs.writeFile(cartPath, JSON.stringify(cart), err =>{ console.log(err);})
            // JSON.stringify(cart,null,4) >>> the file indentation , 4>>> how many space to indentate
            fs.writeFile(cartPath, JSON.stringify(cart,null,4), err =>{ console.log(err);})
        })
            
    }

    static deleteProduct(id, price){
        fs.readFile(cartPath,(err,content)=>{
            if(err){
                return
            }
       
        const updatedCart = { ...JSON.parse(content) }  // pasrse json file to js obj
            const product = updatedCart.products.find(p => p.id === id)  // .find() >>> returns the value of the first element that passes a test.
            
            if(!product){
                return
            }

            const productQty = product.quantity
            updatedCart.products = updatedCart.products.filter(p => p.id !== id)   // .filter() >>> creates a new array filled with elements that pass a test  
            updatedCart.totalPrice = updatedCart.totalPrice - price * productQty

            //.stringify() >>> Converts a JavaScript value to a JavaScript Object Notation (JSON) string.
            fs.writeFile(cartPath, JSON.stringify(updatedCart), err => { console.log(err)})

        })
        
    }


}