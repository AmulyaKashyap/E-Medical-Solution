const mongoose =require('mongoose');
const multer =require('multer');
const path =require('path');//to specify paths
const DOC_AVATAR_PATH = path.join('/uploads/doctors/avatars');//path where user uploaded avatars are going to be stored


const doctorSchema =new mongoose.Schema({
    about:String,
    email:{ type:String, required:true, unique:true,},
    phoneNumber: Number,
    exp:Number,
    avatar:{
        type:String
    },
    specialization:{type:String,default:"Specialisation not entered"},
    degree:{type:String,default:"none mentioned"},
    password:{ type:String, required:true},
    name:{  type: String ,default:"not mentioned"},
    lname:{  type: String ,default:""},
    isDoctor:{ type: Boolean, required: true, default: true },      // to render doctor specific views/pages
    rating:{ type:Number, min:0, max:5 },
    availableService:{type:[String], default:"None"},
    isavailable:{ type:Boolean, default:false },
    address:{
        lane:String,
        city:String,
        state:String,
        country:String
    },
    price : Number // check online status  - online/offline
    },
    { timestamps: true
});

//disk storage
let storage4 = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(__dirname,'..',DOC_AVATAR_PATH));//storage path of uploads avatar
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, file.fieldname + '-' + uniqueSuffix);
    }
 });



 //static function
 doctorSchema.statics.uploadedAvatar= multer({storage:storage4}).single('avatar');
 doctorSchema.statics.avatarPath =DOC_AVATAR_PATH; //now avatar path is publically available
 
const Doctor =mongoose.model('Doctor',doctorSchema);

module.exports = Doctor;