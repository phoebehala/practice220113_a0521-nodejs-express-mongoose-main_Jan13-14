const Products = require('../models/product.model')
const Cart = require('../models/cart.model')

const getById = (productId) =>{
    // in mongoDB, we need to convert string id to mongoDB objectID ; in mongoose, it does it for us
    return Products.findById(productId, (err,data)=>{
        if (err) console.log(err);
        return data;
    }).clone() //.clone() >>> Make a copy of this query so you can re-execute it
}


exports.getProducts = (req,res,next) => {
    
    const isAuth = req.get('Cookie').split("=")[1]
    console.log('login cookie from shopping controller:',req.get('Cookie').split("=")[1]); //loggedIn=true

    if(isAuth){ // if the user has already logged in
        
        // Model.find() >>> find all 
        // QueryCursor
        Products.find((err, data) => {
            if (err) console.log(err)
        
            //console.log("find() data:",data); // retruns an array with each product inside
            
            res.render('shop/product-list', {
              pageTitle: 'Home - All Products',
              products: data,
            })
          })
    }else{  // send the user to login page


}

    /* wrong !!
    Products.find().then((products) => {
        console.log('prod: ', products);
        const tempProducts = products.map(p => ({ ...p, description: `${p.description.slice(0, 25)}...` })) // ...p >>> to copy all the properties of a product   ; description: `${p.description.slice(0, 25)}...` >>> override the value of description property 
        
        res.render('shop/product-list', {
            pageTitle: 'All Products',
            products: tempProducts
        })


    }).catch(err => console.log(err))
    */
}

exports.getProductById = async (req,res,next) => {
    // instead of doing >>> const prodId = req.params.productId
    //  {productId} >>> to create a nested ogject property
    const {params: {productId}} = req
    const product = await getById(productId);
    //console.log(product);  // if we don't use .clone(), it's a cursor object

    res.render('shop/product-detail', {
        pageTitle: product.title,
        product: product
    })  
}



exports.postCart = async (req, res, next) =>{
                                            // .productId >>> is the name from shop/product-list.ejs   <input type="hidden" name="productId" value="<%= product._id %>" />
    const {productId, productPrice} = req.body // .productPrice >>> is the name from shop/product-list.ejs   <input type="hidden" name="productPrice" value="<%= product.price %>" />
    //console.log(productId, productPrice);

    const product = await getById(productId)
    //console.log('the product was just added',product);  // if we don't use .clone(), it's a cursor object

    //console.log('req.user from postCart:', req.user);
    // .addToCart() >>> custom method form user.model
    await req.user.addToCart(product)
    console.log('req.user from postCart:', req.user);
    
    res.redirect('/')
}

exports.getCart = (req, res, next) => {

    // const cartItems = req.user.cart.items  // an array from user model   // [{productId: , quantity: }, {}, {}]

    // mongoose: populate() lets you reference documents in other collections.
    req.user.populate('cart.items.productId').then((user) => {
        console.log('user from .getCart',user);
        const products = user.cart.items
        console.log('user.cart.items from .getCart', products);
  
        res.render('shop/cart', {
            pageTitle: 'Your Cart',
            products: products,
            totalPrice: products.reduce(   // for each iteration, accumulate by subtotal which is (curr.quantity * curr.productId.price) of each item
                (acc, curr) => acc + curr.quantity * curr.productId.price,
                0
            ),
        })
    })
}


exports.postCartDeleteProduct= async (req, res, next)=>{
    const {productId} = req.body  // .productId >>> is the name from shop/cart.ejs   <input type="hidden" name="productId" value="<%= product.productData.id %>" />

    req.user.removeFromCart(productId).then(() => {
        res.redirect('/cart')
      })

}