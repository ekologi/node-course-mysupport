module.exports = {
    ensureAuthenticated: function (req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        }
        req.flash('error_msg','Anda tidak memiliki otorisasi');
        res.redirect('/users/login');
    }
}