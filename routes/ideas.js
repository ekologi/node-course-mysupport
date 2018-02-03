const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const { ensureAuthenticated } = require('../helpers/auth');
//load model
require('../models/Idea');
const Idea = mongoose.model('ideas');

//Tambah Ideas router 
router.get('/add', ensureAuthenticated, (req, res) => {
    res.render('ideas/add');
});

//Rubah Ideas router 
router.get('/edit/:id', ensureAuthenticated, (req, res) => {
    Idea.findOne({
        _id: req.params.id
    })
        .then(idea => {
            if (idea.user != req.user.id) {
                req.flash('error_msg','Anda bukan user yg berwenang');
                res.redirect('/ideas');
            } else {
                res.render('ideas/edit', {
                    idea: idea
                });                
            }

        })

});

//PUT/edit Ideas router 
router.put('/:id', ensureAuthenticated, (req, res) => {
    Idea.findOne({
        _id: req.params.id
    })
        .then(idea => {
            idea.title = req.body.title;
            idea.details = req.body.details;
            idea.save()
                .then(idea => {
                    res.redirect('/ideas');
                })
        })
});
//PUT/edit Ideas router 
router.delete('/:id', ensureAuthenticated, (req, res) => {
    Idea.remove({ _id: req.params.id })
        .then(() => {
            res.redirect('/ideas');
        });
});


router.get('/', ensureAuthenticated, (req, res) => {
    Idea.find({user:req.user.id})
        .sort({ date: 'desc' })
        .then(ideas => {
            res.render('ideas/index', {
                ideas: ideas
            });
        });

});

router.post('/', ensureAuthenticated, (req, res) => {
    //form validation
    req.checkBody('title', 'Title field is required').notEmpty();
    req.checkBody('details', 'Detail field is required').notEmpty();
    //check error
    var errors = req.validationErrors();
    if (errors) {
        res.render('ideas/add', { errors: errors });
    } else {
        var newIdea = {
            title: req.body.title,
            details: req.body.details,
            user: req.user.id
        }
        new Idea(newIdea)
            .save()
            .then(idea => {
                req.flash('success_msg', 'You are success submitted an idea');
                res.redirect('/ideas');
            })

    }

});


module.exports = router;