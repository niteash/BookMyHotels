const User = require('../models/user')

module.exports.signUpIndexroute = async (req, res) => {
  res.render("users/signUp.ejs");
}

module.exports.signUpPostRoute = async (req, res) => {
  try {
    let { username, email, password } = req.body;
    const newUser = new User({ email, username });
    const registeredUser = await User.register(newUser, password);
    console.log(registeredUser);
    req.login(registeredUser, (err) => {
      if (err) {
        return next(err);
      }
      req.flash("success", "Registration is successful!");
      res.redirect("/listings");
    });
  } catch (err) {
    req.flash("error", err.message);
    res.redirect("/signUp");
  }
}

module.exports.getloginRoute = async (req, res) => {
  res.render("users/login.ejs");
}

module.exports.postLoginRoute = async (req, res) => {
    req.flash("success", "Welcome to BookMyHotels!");
    let redirectUrl =  res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
  }

module.exports.logoutRoute =  (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "You are logged out now!");
    res.redirect("/listings");
  });
}