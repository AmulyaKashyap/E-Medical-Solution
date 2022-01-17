//setting up mongoose 
const mongoose =require('mongoose');//required library

//connected to db
mongoose.connect(process.env.MONGODB_URI||'mongodb://localhost/MediCare');
const db = mongoose.connection;

//if there is error in connection
db.on('error', console.error.bind(console, "Error connecting to MongoDB"));
db.once('open', function(){
    console.log('Connected to Database :: MongoDB');
});

//db is going to be used for accessing db
module.exports = db;

