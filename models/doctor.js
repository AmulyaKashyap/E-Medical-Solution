const mongoose =require('mongoose');

const doctorSchema =new mongoose.Schema({
    email:{ type:String, required:true, unique:true,},
    phoneNumber: Number,
    specialization:{type:String,default:"Specialisation not entered"},
    degree:{type:String,default:"none mentioned"},
    password:{ type:String, required:true},
    name:{  type: String ,default:"not mentioned"},
    lname:{  type: String ,default:"not mentioned"},
    isDoctor:{ type: Boolean, required: true, default: true },      // to render doctor specific views/pages
    rating:{ type:Number, min:0, max:5 },
    isavailable:{ type:Boolean, default:false },
    address:{
        city:String,
        state:String,
        country:String
    },
    price : Number // check online status  - online/offline
    },
    { timestamps: true
});

const Doctor =mongoose.model('Doctor',doctorSchema);

module.exports = Doctor;