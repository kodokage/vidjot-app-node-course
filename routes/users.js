const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');

const User = require('../models/Users');

router.get('/register', (req, res)=> res.render('users/register'));

router.get('/login', (req, res)=> res.render('users/login'));

router.post('/register', (req, res) =>{
const {name, email, password, password2} = req.body;
let errors = [];
if(!name || !email || !password || !password2 ){
    errors.push({msg:'Please fill all fields'});
}
if(password != password2){
    errors.push({msg:'Passwords do not match'});
}
if(password.length < 6){
    errors.push({msg:'Password must be atleast 6 characters'});
}
if(errors.length > 0){
    res.render('users/register', {
        errors,
        name,
        email,
    });
}else{
    User.findOne({email:email})
    .then(user=>{
        if(user){
            errors.push({msg:'Email already exists'});
            res.render('users/register', {
                errors,
                name,
                email
            });
        }else{
            const newUser = new User({
                name,
                email,
                password
            });
            bcrypt.genSalt(10, (err, salt) => 
            bcrypt.hash(newUser.password, salt, (err, hash)=>{
                if(err) throw err;
                newUser.password = hash;

                newUser.save()
                .then(user => {
                    res.redirect('/users/login');
                })
                .catch(err => console.log(err));
            }));
        }
    });
}

});
//Login Form Post
router.post('/login', (req, res, next)=>{
    passport.authenticate('local', {
        successRedirect:'/ideas',
        failureRedirect:'/users/login',
        failureFlash:true
    })(req, res, next);
});

//Logout User
router.get('/logout', (req, res)=>{
    req.logOut();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/users/login');
});

module.exports = router;