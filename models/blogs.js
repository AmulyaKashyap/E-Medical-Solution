const mongoose =require('mongoose');
const multer =require('multer');
const path =require('path');//to specify paths
const BLOG_IMAGE_PATH= path.join('/uploads/blogs/images');//path where user uploaded avatars are going to be stored

const Schema =mongoose.Schema;

const blogsSchema =new mongoose.Schema({
    blogImage:{type:String},
    uploadBy:String ,
    category:String,
    content:String,
    date:Date,
    title:String
},{
    timestamps: true
});


//disk storage
let storage3 = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(__dirname,'..',BLOG_IMAGE_PATH));//storage path of uploads reports
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, file.fieldname + '-' + uniqueSuffix);
    }
 });

 //
 blogsSchema.statics.uploadedblogImg= multer({storage:storage3}).single('blogImage');
 blogsSchema.statics.blogsPath =BLOG_IMAGE_PATH; 


 const Blogs =mongoose.model('Blogs',blogsSchema);

 module.exports = Blogs;