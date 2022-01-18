//setting up mongoose 
const mongoose =require('mongoose');//required library

//connected to db
mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true }).then(() => {
    console.log('Connected to mongoDB')
}).catch(e => {
    console.log('Error while DB connecting');
    console.log(e);
});
const db = mongoose.connection;

//if there is error in connection
db.on('error', console.error.bind(console, "Error connecting to MongoDB"));
db.once('open', function(){
    console.log('Connected to Database :: MongoDB');
});

//db is going to be used for accessing db
module.exports = db;

