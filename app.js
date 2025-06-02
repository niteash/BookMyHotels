const express = require("express");
const app = express();
const mongoose = require ("mongoose");
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const ExpressError = require('./utils/ExpressError');
const { listingSchema, reviewSchema } = require('./schema');
const Review  = require('./models/review');
const review = require("./models/review");
const cookieParser = require('cookie-parser');
const session = require('express-session')
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy  = require('passport-local');
const User = require('./models/user.js');

app.use(cookieParser());

const listingsRouter = require ('./routes/listing')
const reviewsRouter = require ('./routes/reviews');
const UserRouter = require('./routes/user.js')

const { serialize, deserialize } = require("v8");
const user = require("./models/user.js");
//connecting db  (2nd step)
const MONGO_URL = "mongodb://127.0.0.1:27017/bookMyHotels";

main().then(()=>{
    console.log("Connected to DB")
}).catch((err)=>{
    console.log('Error')
})
async function main(){
    mongoose.connect(MONGO_URL);
}

//ejs
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))
app.use(express.urlencoded({extended : true}))
//css
app.use(express.static(path.join(__dirname, '/public')));
//ejs mate
app.engine('ejs', ejsMate);
//method Override
app.use(methodOverride("_method"))
//session
const sectionOption = {
    secret : 'mysuperSecretCode',
    resave : false,
    saveUninitialized : true,
    cookie : {
        expires : Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge : 7 * 24 * 60 * 60 * 1000,
        httpOnly : true

    }
};
app.get("/",(req,res)=>{
    res.send("Welcome to Home")
})


app.use(session(sectionOption));
//flash
app.use(flash());
//passport
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next)=>{
    res.locals.success = req.flash('success');
     res.locals.error = req.flash('error');
    next();
})

// app.get('/demoUser', async (req, res)=>{
//      let fakeUser = new User({
//         email : "fakestudent@gmail.com",
//         username : "ShweFake"
//      });

//   const newUser =   await User.register(fakeUser, "helloworld");
//  res.send(newUser )
// })

//index (listings)
app.use('/listings', listingsRouter);
app.use ('/listings/:id/reviews', reviewsRouter);
app.use('/', UserRouter);

app.use((err, req, res, next) =>  { 
    let {statusCode = 500 , message = "Something went wrong!"} = err;
    res.status(statusCode).render('error.ejs', {message})

})

app.listen(8080,  ()=>{
   console.log("Server has started at 8080 port!")
})
