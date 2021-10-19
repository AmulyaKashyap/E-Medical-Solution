const express=require('express');
const app=express();
const port=8000; //80 while deploying


//use static files:
app.use(express.static('assets'));



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
