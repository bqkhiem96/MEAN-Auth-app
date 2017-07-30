const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const router = express.Router();
const config = require('../config/database');
const User = require('../models/user');

//REGISTER
router.post('/register',(req, res, next)=>{
    let newUser = new User({
        name: req.body.name,
        email: req.body.email,
        username: req.body.username,
        password: req.body.password
    })

    User.addUser(newUser, (err, user) =>{
        if(err){
            res.json({success:false, msg:'Failed to register user'})
        }else{
            res.json({success: true, msg:'User registered'});
        }
    });
});

//AUTHENTICATE
router.post('/authenticate',(req, res, next)=>{
    const username = req.body.username;
    const password = req.body.password;

    User.getUserByUsername(username, (err, user)=>{
        if(err) throw err;
        //If not a user returns, we send the response to the client
        if(!user){
            return res.json({success: false, msg:'User not found'});
        }
        //Compare password to see if it matches the given password
        User.comparePassword(password, user.password, (err, isMatch)=>{
            if(err) throw err;
            if(isMatch){
                const token = jwt.sign(user, config.secret, {
                    expiresIn: 604800 //1 week before expired
                });
                res.json({
                    success: true,
                    token: 'JWT ' + token,
                    user:{
                        id: user._id,
                        name: user.name,
                        username: user.username,
                        email: user.email
                    }
                });
            }else{
                 return res.json({success: false, msg: 'Wrong password'});
            }
        });
    })
});

//PROFILE 
router.get('/profile',passport.authenticate('jwt',{session: false}),(req, res, next)=>{
    res.json({user: req.user});
});


module.exports = router;