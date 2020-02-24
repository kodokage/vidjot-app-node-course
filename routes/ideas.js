const express = require('express');
const router = express.Router();
const {ensureAuthenticated} = require('../helpers/auth');

const Idea = require('../models/Idea');


//Add ideas
router.get('/add', ensureAuthenticated, (req, res)=>{
    res.render('ideas/add');
});

//Edit ideas
router.get('/edit/:id', ensureAuthenticated, (req, res)=>{
    Idea.findOne({
        _id: req.params.id
    })
    .then(idea => {
        if(idea.user != req.user.id){
            req.flash('error_msg', 'Not Authorized');
            res.redirect('/ideas');
        }else{
            res.render('ideas/edit', {
                idea:idea
            });

        }
       
    }).catch(err => console.log(err));
});

//Handle add idea form
router.post('/', (req, res)=>{
    const {title, details} = req.body;
    //console.log(req.body);
    let errors = [];
    if(!title){
        errors.push({text:'Please add a title'});
    }
    if(!details){
        errors.push({text:'Please add details'});
    }
    if(errors.length > 0){
        res.render('/add', {
            errors,
            title,
            details
        });
    }else{
        const newIdea = new Idea({
            title,
            details,
            user: req.user.id
        });
        newIdea.save()
        
        .then(idea =>{ 
            req.flash('success_msg', 'Video Idea added');
            res.redirect('/ideas')})
        .catch(err => console.log(err));
    }
});
//Idea Index Page
router.get('/', ensureAuthenticated, (req, res) =>{
    Idea.find({user: req.user.id})
    .sort({date:'desc'})
    .then(ideas =>{
        res.render('ideas/index', {ideas:ideas})
    });
});

//Edit form
router.put('/:id', (req, res)=>{
    Idea.findOne({
    _id: req.params.id
    })
    .then(idea =>{
        //New vaues
        idea.title = req.body.title;
        idea.details = req.body.details;

        idea.save()
        .then(idea => {
            res.redirect('/ideas');
        })
    })
});

//Delete ideas
router.delete('/:id', (req, res)=> {
    Idea.remove({_id: req.params.id})
    .then(()=>{
        req.flash('success_msg', 'Video Idea removed');
        res.redirect('/ideas');
    });
});

module.exports = router;