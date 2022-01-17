exports.getLogin = (req,res,next) => {

    // views: auth/login.ejs
    res.render('auth/login', {
        pageTitle: 'Login'
    })
}

exports.postLogin = (req,res,next) => {
    res.isLoggedIn =true;
    res.redirect('/')
}

exports.postLogout = (req,res,next) => {
    res.redirect('/')
}