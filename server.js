const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
// const mongoConnect = require('./util/db-mongo').mongoConnect
const mongoose = require('mongoose')
require('dotenv').config()


const shopRoute = require('./routes/shop.route')
const adminRoute = require('./routes/admin.route')
const authRoute = require('./routes/auth.route')

const User = require('./models/user.model')

const app = express()

app.set('view engine', 'ejs')

app.use(bodyParser.urlencoded({extended:false}))
// app.use('/public', express.static('public'))
app.use(express.static(path.join(__dirname, 'public')))

// dummy auth flow
 app.use((req, res, next)=>{
     /* hard code to insert a new user to db
     const user = new User('admin', 'admin@hala.com')
     user.save().then(result => {
             console.log(result)
             next()
         }).catch(err=>console.log(err))
     */
    User.findById('61e205452fed7385efa97a17', (err, user)=>{
        if(err) console.log(err);

        if(!user){
            const user = new User({
                username: 'aa',
                email:'aa@hala.com',
                cart:{
                    items:[]
                }
            })
            user.save();
        }
        // if there is an user
        req.user = user
        next()
    })
         
 })

app.use('/admin', adminRoute)
app.use(shopRoute)
app.use(authRoute)
app.use((req,res,next) => {
    res.status(404).render('404', { pageTitle: 'Page Not Found'})
})

const PORT = process.env.PORT || 8000

// after the connection successfully connected, fire the callback () => { app.listen(PORT)}
/* mongoDB 
mongoConnect(() => {
    app.listen(PORT)
})
*/

// mongoose
mongoose.connect(process.env.MONGODB_URL, () => {
    app.listen(PORT)
})