const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const userController  = require('../controllers/users.js')

router.route('/signUp')
.get(userController.signUpIndexroute )
.post(userController.signUpPostRoute)

router.route('/login')
.get(userController.getloginRoute )
.post(
  saveRedirectUrl,
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  userController.postLoginRoute
)

router.get("/logout", userController.logoutRoute);

module.exports = router;
