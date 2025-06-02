const express = require("express");
const app = express();
const cookieParser = require('cookie-parser');
const session = require('express-session');
const flash = require('connect-flash');
const path = require('path');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

// app.use(cookieParser("007"));
let sectionOption = 
    {
        secret : "mysupersecretstring", 
        resave : false, 
        saveUninitialized : true
    };
app.use(session(sectionOption));
app.use(flash());

app.use((req, res, next)=>{
 res.locals.success = req.flash('success');
 res.locals.error = req.flash('error');
 next();
})

app.get('/register', (req, res)=>{
    let {name = 'anonymous'} = req.query;
    req.session.name = name;
    console.log(req.session.name);

    if(name === 'anonymous'){
    req.flash('error','fail to register!'); 

    }else{
    req.flash('success','user registration is successful!'); 

    }

    res.redirect('/hello')
})

app.get('/hello', (req,res)=>{
   
    res.render('page.ejs', {name : req.session.name})
})


app.get('/testroute', (req, res)=>{
    res.send("Test succesful")
})

// app.get("/reqcount", (req, res)=>{
//     if(req.session.count){
//         req.session.count++;
//     }else{
//     req.session.count = 1;

//     }
//     res.send(`You sent a request ${req.session.count} time`)
// })


// app.get('/getcookies', (req, res)=>{
//     res.cookie('greet', 'hello, this is nicky')
//     console.dir(req.cookies)
//     res.send('send you some cookies')
// })

// app.get('/cookies', (req, res) => {
//     let {name = 'anonymous'} = req.cookies;
//     res.send(`Hi, ${name}`)
// });

// app.get('/mycookies', (req, res)=>{
//     res.cookie('made-in', 'myanmar', {signed : true});
//     res.send('signed cookie done sending!');
//     console.log("this is unsignedcookies - ", req.cookies);
//     console.log("this is signedcookies - ",req.signedCookies)
// })

app.listen(3000, ()=>{
    console.log("Server is listening at 3000")
})
