const User = require('../models/user.model');

// to encrypt // to hash password
const bcrypt = require('bcrypt')

exports.getLogin = (req,res,next) => {

    // views: auth/login.ejs
    res.render('auth/login', {
        pageTitle: 'Login'
    })
}

exports.postLogin = (req,res,next) => {
   
    // res.isLoggedIn =true;
    // res.setHeader('Set-Cookie', 'loggedIn=true')   /* for Cookie */
    
    console.log(req.body);  // req.body >>> is the name from auth/login.ejs   such as  <input class="input" type="text" name="username" />
    
    /*  decrypt hash password to compare with encrypted password */
    const { username, password } = req.body

    User.findOne({ username: username }, (err, user) => {
        if(err) console.log(err)

        if(!user){
            return res.redirect('/login')
        }
        
        // decrypt hash password to compare with encrypted password
        bcrypt.compare(password, user.password).then((isMatching) => {
            if(isMatching){
                req.session.user = user
                req.session.isLoggedIn = true
                return req.session.save(err => {
                    if(err) console.log(err)
        
                    res.redirect('/')
                })
            }

            res.redirect('/login')
        }).catch(err => {
            console.log(err)
        })

    } )
    
        
    /*
    const { username, password } = req.body

    // .findOne() >>> the first found document is passed to the callback.
    User.findOne({ username: username }, (err, user) => {
        if(err) console.log(err)

        if(!user){
            return res.redirect('/login')
        }
        
        if(user.password !== password){
            return res.redirect('/login')
        }

        req.session.user =user;
        req.session.isLogged =true   // Access the session as req.session
        return req.session.save(err=>{
            if(err) console.log(err);
            res.redirect('/')
        })
        

    } )
    */
   
}

exports.getSignUp = (req,res,next) => {
    res.render('auth/signup', {
        pageTitle: 'Sign Up'
    })
} 

exports.postSignUp = async (req,res,next) => {

    /*  to hash password */
    const { username, email, password, confirmPassword } = req.body

    const passwordMatch = password === confirmPassword ? password : null

    if(passwordMatch){

        await bcrypt.hash(password, 12).then((hashedPassword) => {

            const user = new User({
                username: username,
                email: email,
                password: hashedPassword,
                cart: { items: [] }
            })
            return user.save()
        }).then(() => {
            res.redirect('/login')
        }).catch(err => {
            console.log(err)
        })

    }else{
        res.redirect('/signup')

    }

    /*  without hashing password

    const { username, email, password, confirmPassword } = req.body

    const passwordMatch = password === confirmPassword ? password : null

    if(passwordMatch){

            const user = new User({
                username: username,
                email: email,
                password:  password,
                cart: { items: [] }
            })
            return user.save()
    }
    */
    
}

exports.postLogout = (req,res,next) => {
    req.session.destroy(err => {
        if(err) console.log(err)
        res.redirect('/')
    })

}