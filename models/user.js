const mongoose =require('mongoose');

const userSchema =new mongoose.Schema({
    email:{ type:String, required: true, unique: true,},
    phoneNumber: Number,
    password:{ type:String, required:true },
    name:{ type: String, required: true },
    age:{ type: Number, min: 18, max: 65 },
    gender:{ type: String, enum: ["Male", "Female",] },
    height: Number,
    weight: Number,
    address:{
        city:String,
        state:String,
        country:String
    },
    isDoctor:{ type: Boolean, required: true, default:false}

},{
    timestamps: true
});

const User =mongoose.model('User',userSchema);

module.exports = User;