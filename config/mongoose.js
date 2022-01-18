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

//db is going to be used for accessing db
module.exports = db;

