const express=require('express');
const app=express();
const port=8000; //80 while deploying
const cookieParser =require('cookie-parser');
const db = require('./config/mongoose');

const session = require('express-session');
const passport = require('passport');
const passportLocal = require('./config/passport-local-strategy');
const MongoStore = require('connect-mongo');


const expressLayouts = require('express-ejs-layouts');

//reading from post request
app.use(express.urlencoded());

//cookie parser
app.use(cookieParser());

//use static files:
app.use(express.static('./assets'));

app.use(expressLayouts);
// extract style and scripts from sub pages into the layout
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);


//setting up a view engine
app.set('view engine','ejs');
app.set('views','./views');


//mongostore is used to store session cookie in the db
app.use( session({
    name:'aman',
    secret:'Pachouri',
    saveUninitialized:false,
    resave:false,
    cookie:{
        maxAge:(1000*60*100)
    },
    store:MongoStore.create(
        {
            mongoUrl:db,
            autoRemove:'disabled'
        },
        function(err){
            console.log(err || 'connect-mongo setup ok');
        }
    )
    
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(passport.setAuthenticatedUser);


 //use express router
app.use('/',require('./routes/index'));


app.listen(port,function(err){
    if(err){
        console.log(`Error: ${err}`);
        return;
    }
    console.log(`Server is running on port: ${port}`);
});
