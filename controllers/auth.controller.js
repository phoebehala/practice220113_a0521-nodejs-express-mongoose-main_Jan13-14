exports.getLogin = (req,res,next) => {

    // views: auth/login.ejs
    res.render('auth/login', {
        pageTitle: 'Login'
    })
}

exports.postLogin = (req,res,next) => {
    console.log(req.body);  // req.body >>> is the name from auth/login.ejs   such as  <input class="input" type="text" name="username" />
    
    // res.isLoggedIn =true;
    res.setHeader('Set-Cookie', 'loggedIn=true')
    res.redirect('/')
}

exports.postLogout = (req,res,next) => {
    res.redirect('/')
}