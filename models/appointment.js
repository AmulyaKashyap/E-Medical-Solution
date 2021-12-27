const mongoose =require('mongoose');
const Schema =mongoose.Schema;


const appointmentSchema = new mongoose.Schema({
    patientId:{ type: Schema.Types.ObjectId, ref: 'User' },
    doctorId:{ type: Schema.Types.ObjectId, ref: 'Doctor' },
    date: {type:Date, index:true},
    time: { type:String},
    meeting:Boolean,                                    //true - online, false - offline
    transactionId:String,             
    transactionStatus:String,
    isDone:Boolean                                      //appointment is done/scheduled or not  true-done ,false-not done        
});

const Appointment =mongoose.model('Appointment',appointmentSchema);

module.exports = Appointment;