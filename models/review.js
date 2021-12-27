const mongoose =require('mongoose');
const Schema =mongoose.Schema;

const reviewSchema =new mongoose.Schema({
    rating:Number,
    givenTo:{ type:Schema.Types.ObjectId, ref: 'Doctor' },
    givenBy:{ type: Schema.Types.ObjectId, ref: 'User' },
    date:Date,
    content:String
},{
    timestamps: true
});

const Review =mongoose.model('Review',reviewSchema);

 module.exports = Review;