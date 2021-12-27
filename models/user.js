const mongoose =require('mongoose');
const multer =require('multer');
const path =require('path');//to specify paths
const USER_AVATAR_PATH = path.join('/uploads/users/avatars');//path where user uploaded avatars are going to be stored


const userSchema =new mongoose.Schema({
    email:{ type:String, required: true, unique: true,},
    phoneNumber: Number,
    password:{ type:String, required:true },
    avatar:{
        type:String
    },
    name:{ type: String,default:"not given"},
    lname:{ type: String,default:""},
    age:{ type: Number, min: 0, max: 100 },
    gender:{ type: String, enum: ["Male", "Female","Others"] },
    height: Number,
    bodyWeight: {type:[Number],index:true},
    bloodGroup:String,
    temprature:{ type: Number, min: 40, max: 110 },
    address:{
        lane:String,
        city:String,
        state:String,
        country:String
    },
    bloodSugar:{type:[Number],index:true},
    BP:{type:[{
        bplvalue:Number,
        bphvalue:Number
    }],index:true},
    isDoctor:{ type: Boolean, required: true, default:false}

},{
    timestamps: true
});

//disk storage
let storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(__dirname,'..',USER_AVATAR_PATH));//storage path of uploads avatar
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, file.fieldname + '-' + uniqueSuffix);
    }
 });



const validate = (user) => {
    const schema = Joi.object({
        name: Joi.string().required(),
        email: Joi.string().email().required(),
        password: Joi.string().required(),
    });
    return schema.validate(user);
};




 //static function
 userSchema.statics.uploadedAvatar= multer({storage:storage}).single('avatar');
 userSchema.statics.avatarPath =USER_AVATAR_PATH; //now avatar path is publically available
 
const User =mongoose.model('User',userSchema);

module.exports = User;