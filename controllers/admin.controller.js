const Product = require('../models/product.model')

const getById = (productId) => {
    return Product.findById(productId, (err, data) => {
        if(err) console.log(err)
        return data
    }).clone()
}

exports.getAllProducts = (req, res, next) => {
  Product.find((err, products) => {
    if (err) console.log(err)

    res.render('admin/products', {
      pageTitle: 'All Products',
      products: products,
      isAuth: req.user,
    })
  })
}

exports.getAddProduct = (req, res, next) => {
  res.render('shop/add-edit-product', {
    pageTitle: 'Add Product',
    editing: false,
  })
}

exports.postAddProduct = async(req, res, next) => {
  const { title, imageUrl, description, price } = req.body

  const product = new Product({ title, imageUrl, description, price, userId: req.user }) // userId: req.user >>> to show who create this product
  await product.save()
  res.redirect('/')
}

exports.getEditProduct = async(req, res, next) => {
  const editMode = req.query.edit
  if (!editMode) res.redirect('/')

  const { productId } = req.params
  const product = await getById(productId)

  res.render('shop/add-edit-product', {
    pageTitle: 'Edit Product',
    editing: editMode,
    product: product,
  })
}

exports.postEditProduct = async(req, res, next) => {
    const { productId, title, imageUrl, description, price } = req.body

    const product = await getById(productId)
  
    product.title = title
    product.imageUrl = imageUrl
    product.description = description
    product.price = price
  
    await product.save()
    res.redirect('/')
}

exports.postDeleteProduct = (req, res, next) => {

}
