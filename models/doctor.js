const mongoose =require('mongoose');

const doctorSchema =new mongoose.Schema({
    email:{ type:String, required:true, unique:true,},
    phoneNumber: Number,
    password:{ type:String, required:true},
    name:{  type: String, required:true},
    isDoctor:{ type: Boolean, required: true, default: true },      // to render doctor specific views/pages
    rating:{ type:Number, min:0, max:5 },
    isavailable:{ type:Boolean, default:false },
    price : Number // check online status  - online/offline
    },
    { timestamps: true
});

const Doctor =mongoose.model('Doctor',doctorSchema);

module.exports = Doctor;