const express=require('express');
const app=express();
const port=8000; //80 while deploying
const cookieParser =require('cookie-parser');
const db = require('./config/mongoose');
const expressLayouts = require('express-ejs-layouts');

//reading from post request
app.use(express.urlencoded());

//cookie parser
app.use(cookieParser());

//use static files:
app.use(express.static('assets'));

app.use(expressLayouts);
// extract style and scripts from sub pages into the layout
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);



//setting up a view engine
app.set('view engine','ejs');
app.set('views','./views');

//use express router
app.use('/',require('./routes/index')); 

app.listen(port,function(err){
    if(err){
        //console.log('Error: ',err);
        console.log(`Error: ${err}`);
        return;
    }
    console.log(`Server is running on port: ${port}`);
});
