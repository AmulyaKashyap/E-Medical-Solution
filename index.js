const express=require('express');
const app=express();
const port=8000; //80 while deploying

app.listen(port,function(err){
    if(err){
        //console.log('Error: ',err);
        console.log(`Error: ${err}`);
        return;
    }
    console.log(`Server is running on port: ${port}`);
});
