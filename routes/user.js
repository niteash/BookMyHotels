const express = require("express");
const router = express.Router();
const User = require('../models/user.js');
const passport = require("passport");

router.get('/signUp', (req, res)=>{
    res.render('users/signUp.ejs')
})

router.post('/signUp', async(req, res)=>{
  try{
      let {username , email, password} = req.body;
   const newUser = new User({email, username})
   const registeredUser = await User.register(newUser, password);
   console.log(registeredUser);
   req.flash('success', 'Registration is successful!')
   res.redirect('/listings');
  }catch(err){
    req.flash('error', err.message);
    res.redirect('/signUp')
  }
})

router.get('/login', (req, res)=>{
    res.render('users/login.ejs')
})
 
router.post(
    '/login', 
    passport.authenticate('local',{
        failureRedirect : '/login', 
        failureFlash : true
    }),
        async(req, res)=>{
 req.flash('success','Welcome to BookMyHotels!');
 res.redirect('/listings');
}
);

module.exports = router; 