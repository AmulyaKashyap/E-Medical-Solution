const mongoose =require('mongoose');
const multer =require('multer');
const path =require('path');//to specify paths
const REPORTS_PATH = path.join('/uploads/reports');
const Schema =mongoose.Schema;

const reportSchema =new mongoose.Schema({
    report:String,
    type:String,
    uploadByPat:{ type:Schema.Types.ObjectId, ref: 'User' },
    uploadByDoc:{ type: Schema.Types.ObjectId, ref: 'Doctor' },
    patientId:{ type: Schema.Types.ObjectId, ref: 'User' },
    date:Date,
    title:String
},{
    timestamps: true
});


//disk storage
let storage2 = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(__dirname,'..',REPORTS_PATH));//storage path of uploads reports
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, file.fieldname + '-' + uniqueSuffix);
    }
 });

 //
 reportSchema.statics.uploadedReport= multer({storage:storage2}).single('reportUploaded');
 reportSchema.statics.reportPath =REPORTS_PATH; 


 const Report =mongoose.model('Report',reportSchema);

 module.exports = Report;