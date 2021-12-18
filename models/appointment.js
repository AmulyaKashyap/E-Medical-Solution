const mongoose =require('mongoose');

const appointmentSchema = new mongoose.Schema({
    patientId:[{ type: Schema.Types.ObjectId, ref: 'User' }],
    doctorId:[{ type: Schema.Types.ObjectId, ref: 'Doctor' }],
    date: Date,
    time: { type:Date, index:true},
    meeting:Boolean,                    //true - online, false - offline
    transaction:String,
    phoneNumber:Number
});

const Appointment =mongoose.model('Appointment',appointmentSchema);

module.exports = Appointment;