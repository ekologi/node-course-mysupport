const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const router = express.Router();
const passport = require('passport');

//load user MODEL
require('../models/User');
const User = mongoose.model('users');

//USER LOGIN ROUTE
//LOGIN
router.get('/login', (req, res) => {
    res.render('users/login');
});
router.post('/login', (req, res, next) => {
    passport.authenticate('local',{
        successRedirect: '/ideas',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req,res,next);
});
//LOG-OUT
router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', 'Anda sudah keluar dari sistem');
    res.redirect('/users/login');
});

//Register GETLOGIN
router.get('/register', (req, res) => {
    res.render('users/register');
}); 

//Register POST
router.post('/register', (req, res) => {
    let errors = [];
    if (req.body.password != req.body.password2) {
        errors.push({text: 'Passwords do not match'});
    }
    if (req.body.password.length < 4) {
        errors.push({ text: 'Passwords at least 4 character' });
    }
    if (errors.length > 0 ) {
        res.render('users/register', {
            errors: errors,
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            password2: req.body.password2        
        });
    } else {
        User.findOne({email: req.body.email})
        .then(user => {
            if (user) {
                req.flash('error_msg','Email sudah ada dan terdaftar');
                res.redirect('/users/register');
            } else {
                const newUser = new User({
                    name: req.body.name,
                    email: req.body.email,
                    password: req.body.password
                });
                //console.log(newUser);
                bcrypt.genSalt(10, function (err, salt) {
                    bcrypt.hash(newUser.password, salt, function (err, hash) {
                        if (err) throw err;
                        newUser.password = hash;
                        newUser.save()
                            .then(user => {
                                req.flash('success_msg', 'Anda sukses login');
                                res.redirect('/users/login');
                            })
                            .catch(err => {
                                console.log(err);
                            });
                    });
                });
            }
        }); 
    }
}); 



module.exports = router;