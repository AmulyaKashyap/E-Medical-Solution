const mongoose =require('mongoose');
const multer =require('multer');
const path =require('path');//to specify paths
const Appointment = require('./appointment');
const PRES_PATH = path.join('/uploads/prescriptions');
const Schema =mongoose.Schema;

const prescriptionsSchema =new mongoose.Schema({
    prescription:String,
    type:String,
    uploadByDoc:{ type: Schema.Types.ObjectId, ref: 'Doctor' },
    patientId:{ type: Schema.Types.ObjectId, ref: 'User' },
    date:Date,
    title:String,
    appointment:{ type: Schema.Types.ObjectId, ref: 'Appointment' }
},{
    timestamps: true
});


//disk storage
let storage2 = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(__dirname,'..',PRES_PATH));//storage path of uploads prescriptionss
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, file.fieldname + '-' + uniqueSuffix);
    }
 });

 //
 prescriptionsSchema.statics.uploadedPrescriptions= multer({storage:storage2}).single('prescriptionsUploaded');
 prescriptionsSchema.statics.prescriptionsPath =PRES_PATH; 


 const Prescriptions =mongoose.model('prescriptions',prescriptionsSchema);

 module.exports = Prescriptions;