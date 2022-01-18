const { localsName } = require('ejs')
var checksum_lib = require('./Paytm/checksum')
var cookieParser = require('cookie-parser')
const config = require('./Paytm/config')
const User = require('../models/user')
const dotenv = require('dotenv').config()
const https =  require("https")
const Doctor = require('../models/doctor');
const Prescriptions=require('../models/prescriptions');
const fs=require('fs');
const Appointment = require('../models/appointment');
const path=require('path');
//importing files for sending calender invite
const sendCalender = require('../features/calenderInvite.js');
const moment =require('moment'); 

const encrypt_decrypt = require('../features/encrypt_decrypt.js')
const { request } = require('http')
const Report = require('../models/reports')


//render user profile-populating user
module.exports.profile =function(req,res){
    Appointment.find({patientId:req.user.id}).sort({date:1}).populate('doctorId').exec(function(err,appointments){
        return res.render('profile', {
            title:'MediCare|User-Dashboard',
            apts:appointments
        });
    });
}
//render chatBot to collect information

module.exports.chatBot =function(req,res){
    User.findOne({_id:req.user.id}, function(err,user){
            var details={}
            details['height']=user.height
            details['weight']=user.bodyWeight
            details['age']=user.age
            details['id']=user._id

            return res.render('chatBot', {
                title:"Chat with Bot",details:details
            })
    })
}
module.exports.editProfile=function(req,res){  
    return res.render('editProfile', {title:'MediCare|Edit-Profile'});
}

module.exports.review=function(req,res){  
    return res.render('rateUs', {title:'MediCare|Review'});
}

//reports
module.exports.reports =function(req,res){
    Report.find({patientId:req.user.id}).populate('uploadByPat').exec(function(err,reports){
        return res.render('reports', {
            title:'MediCare|User-Reports',
            reports:reports
        });
    });
}

module.exports.prescriptions=function(req,res){
    Prescriptions.find({patientId:req.user.id},function(err,reports){
        return res.render('prescriptions', {
            title:'MediCare|User-Prescriptions',
           pres:reports
        });
    });
}


module.exports.signUp = function(req,res){
    if(req.isAuthenticated()){
        return res.redirect('/users/profile');
    }
    return res.render('sign_up', {
        title:"Patient Sign Up"
    })   
}

module.exports.signIn = function(req,res){
    if(req.isAuthenticated()){
        return res.redirect('/users/profile');
    }
    return res.render('sign_in', {
        title:"Patient Sign In"
    })
     
}

//
module.exports.create =function(req,res){
    if(req.body.pass != req.body.cpass){
        req.flash('error', 'Passwords do not match');
        return res.redirect('back');
    }
    User.findOne({email: req.body.email},  function(err, user){
        if(err){req.flash('error', err); return}
        if(!user){
            User.create({name:req.body.fname,lname:req.body.lname,email:req.body.email, password:req.body.pass}, function(err, user){
                if(err){req.flash('error', err); return}
                req.flash('success', 'You have signed up, login to continue!');
                return res.redirect('back')
            })
        }else{
            req.flash('error', 'Email is already is in use');
            return res.redirect('back');
        }
    });
}


//create session for loginn
module.exports.createSession =function(req,res){
    req.flash('success', 'Logged in Successfully');
    res.redirect('/users/profile');
}



//destroy session for logout
module.exports.destroySession =function(req,res){
    const name=req.user.name
    req.logout();
    req.flash('success', name +' Logged out!');

    return res.redirect('/');
}

//upload reports :both user and pathalogy can access it
module.exports.uploadReports= async function(req,res){
        try{
            Report.uploadedReport(req,res,function(err){
                if(err){
                    console.log('********Multer error*****',err);
                }
                if(req.file){
                    console.log(req.file);
                    Report.create({report:Report.reportPath+'/'+req.file.filename,type:req.file.mimetype,patientId:req.params.id,uploadByPat:req.params.id,title:req.body.title}, function(err, user){
                        if(err){req.flash('error', err); return}
                        req.flash('File uploaded');
                        return res.redirect('back');
                    })
                }
            });
        }
        catch(err){
            req.flash('error',err);
            return res.redirect('back');
        }
}


//edit user profile
//for complex file handeling using async and await
module.exports.saveChanges= async function(req,res){
    if(req.user.id==req.params.id){
        try{
            let user =await User.findById(req.params.id);
            User.uploadedAvatar(req,res,function(err){
                if(err){
                    console.log('********Multer error*****',err);
                }
                //console.log(req.file);
                user.name=req.body.fname;
                user.lname= req.body.lname;
                user.phoneNumber=req.body.phoneNumber;
                user.bloodGroup=req.body.blood;
                user.height=req.body.height;
                user.weight=req.body.weight;
                user.age=req.body.age;
                user.address.lane=req.body.lane;
                user.address.city=req.body.city;
                user.address.country=req.body.country;
                user.address.state=req.body.state
                user.gender=req.body.gender;
                if(req.file){

                    /*if(user.avatar){
                        fs.unlinkSync(path.join(__dirname,'..',user.avatar));
                    }*/
                    //saving the path of the uploaded file into the avater field of user
                    user.avatar=User.avatarPath+'/'+req.file.filename;
                }
                user.save();
                return res.redirect('back');
            });
        }
        catch(err){
            req.flash('error',err);
            return res.redirect('back');
        }
    }
    else{
        return res.status(401).send('Unauthorized Access');
    }
}

module.exports.updateSugar =  function(req,res){
    if(req.user.id==req.params.id){
        let user = User.findById(req.params.id);
        user.updateOne({
            $push:{bloodSugar:{
                $each:[req.body.sugLevel],
                $slice:-10
            }}
        },function(err,result){
            if(err){
                req.flash("Error in updating sugar");
                return res.redirect('back');
            }
            req.flash("Sugar level updated");
            return res.redirect('back');
        });
    }
    else{
        return res.status(401).send('Unauthorized Access');
    }
}
module.exports.updateBP =  function(req,res){
    if(req.user.id==req.params.id){
        let user = User.findById(req.params.id);
        
        user.updateOne({
            $push:{BP:{
                $each:[
                {bplvalue:req.body.bplvalue},
                {bphvalue:req.body.bphvalue}],
                $slice:-10
            }}
        },function(err,result){
            if(err){
                req.flash("Error in updating BP");
                return res.redirect('back');
            }
            req.flash("Updated BP");
            return res.redirect('back');
        });
    }
    else{
        return res.status(401).send('Unauthorized Access');
    }
}
module.exports.updateWeight =  function(req,res){
        let user = User.findById(req.params.id);
        user.updateOne({
            $push:{bodyWeight:[req.body.wt]}
        },function(err,result){
            if(err){
                req.flash('error',"Error in updating weight");
                return res.redirect('back');
            }
            req.flash("Weight updated successfully..");
            return res.redirect('back');
        });
}

module.exports.updateTemp =function(req,res){
    let user=User.findById(req.params.id);
    user.updateOne({temprature:req.body.temp},function(err,result){
        if(err){
            req.flash('error', "Ther is an error");
            return res.redirect('back');
        }
        req.flash("Temprature updated successfully..");
        return res.redirect('back');
    });
}


//first_id - patient_id, second_id - doctor_id
module.exports.callnow=function(req,res){
    return res.render('videoroom', {title:'Calling', first_id:req.params.first_id, second_id:req.params.second_id})
}



module.exports.bookAppointment=function(req,res){
    //need to encrypt the doctor id from originating i.e doc_controller/doctorList 
    Doctor.findOne({id: req.params.doctor_id},  function(err, doctor){
        if(err){req.flash('error', "Ther is an error in this booking"); return}
        if(doctor){
            return res.render('bookAppointment', {title:'MediCare|Book Appointment',doc:doctor})
        }
    });
}



//redirection from users to paytm
module.exports.payment =function(req,res){
    var paymentDetails = {
        amount: req.body.amount,
        customerId: req.user.id,
        customerEmail: req.user.email,
        customerPhone: req.user.phoneNumber
    }
    
    //getting data from the form
   const appointment = new Appointment({
        patientId : req.user.id,
        doctorId :  req.body.doctor_id,
        date :      req.body.date+" "+req.body.time,     
        meeting :   true                    //need to received from the form
    })
    appointment.save()
    //console.log("appointment payment - ",req.body.date)
    //console.log("appointment payment - ",appointment.timezone)
    //saving the id  of appointment in cookie so we can access it when paytm send response
    var detail = encrypt_decrypt.encrypt(appointment.id)
    res.cookie("details", detail)
    

    if(!paymentDetails.amount || !paymentDetails.customerId || !paymentDetails.customerEmail || !paymentDetails.customerPhone) {
        res.status(400).send('Payment failed')
    } else {
        var params = {};
        params['MID'] = config.PaytmConfig.mid;
        params['WEBSITE'] = config.PaytmConfig.website;
        params['CHANNEL_ID'] = 'WEB';
        params['INDUSTRY_TYPE_ID'] = 'Retail';
        params['ORDER_ID'] = 'TEST_'  + new Date().getTime();
        params['CUST_ID'] = paymentDetails.customerId;
        params['TXN_AMOUNT'] = paymentDetails.amount;
        params['CALLBACK_URL'] = 'https://medicare-solution.herokuapp.com//users/paytm/callback';
        params['EMAIL'] = paymentDetails.customerEmail;
        params['MOBILE_NO'] = paymentDetails.customerPhone;
        checksum_lib.genchecksum(params, config.PaytmConfig.key, function (err, checksum) {
            var txn_url = "https://securegw-stage.paytm.in/theia/processTransaction"; // for staging
            // var txn_url = "https://securegw.paytm.in/theia/processTransaction"; // for production
            var form_fields = "";
            for (var x in params) {
                form_fields += "<input type='hidden' name='" + x + "' value='" + params[x] + "' >";
            }
            form_fields += "<input type='hidden' name='CHECKSUMHASH' value='" + checksum + "' >";
            
           
            //need to remove given below comment to initiate  payment ---just to bypass the payment process for makhan working 
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.write('<html><head><title>Merchant Checkout Page</title></head><body><center><h1>Please do not refresh this page...</h1></center><form method="post" action="' + txn_url + '" name="f1">' + form_fields + '</form><script type="text/javascript">document.f1.submit();</script></body></html>');
        res.end();

            //req.body.doctor_id - getting from the form
            //var doctor_id = encrypt(Buffer.from(req.body.doctor_id))
            //var patient_id = encrypt(Buffer.from(req.user.id))
           // res.cookie('login', doctor_id.encryptedData)
        
           // res.render('payment_status',{title:'Payment Status',status:"Succes"})
        });
    }
}



module.exports.paymentCallback =function(req,res){
    // Route for verifiying payment
       var html = "";
       var post_data = req.body;
  
       // received params in callback
       // verify the checksum
       var checksumhash = post_data.CHECKSUMHASH;
       // need to check result value if its ture then only we have to proceed ---verifying the payment 
       var result = checksum_lib.verifychecksum(req.body, config.PaytmConfig.key,checksumhash );
       
  
  
       // Send Server-to-Server request to verify Order Status
       var params = {"MID": config.PaytmConfig.mid, "ORDERID": post_data.ORDERID};
  
       checksum_lib.genchecksum(params, config.PaytmConfig.key, function (err, checksum) {
  
         params.CHECKSUMHASH = checksum;
         post_data = 'JsonData='+JSON.stringify(params);
  
         var options = {
           hostname: 'securegw-stage.paytm.in', // for staging
          //hostname: 'securegw.paytm.in', // for production
           port: 443,
           path: '/merchant-status/getTxnStatus',
           method: 'POST',
           headers: {
             'Content-Type': 'application/x-www-form-urlencoded',
             'Content-Length': post_data.length
           }
         };
  
  
         // Set up the request to send to paytm server to verify the status with given order_id
         var response = "";
         var post_req = https.request(options, function(post_res) {
           post_res.on('data', function (chunk) {
             response += chunk;
           });
  
           post_res.on('end', function(){
  
             var _result = JSON.parse(response);
               if(_result.STATUS == 'TXN_SUCCESS') {
                   var status='payment sucess'
               }else {
                   var status='payment failed'
               }
               
               const transactionId=_result.TXNID
               const transactionStatus=_result.STATUS
               const appointmentDetails = encrypt_decrypt.decrypt(req.cookies.details)
               
               Appointment.findOne({_id: appointmentDetails}).populate('doctorId').populate('patientId').then(function(appointment) {
                appointment.transactionId=transactionId,             
                appointment.transactionStatus=transactionStatus,
                appointment.isDone=false
                appointment.save()

                const startTime = appointment.date      // eg : moment()
                const endTime =  appointment.date       // eg : moment(1,'days')
                const eventSummary =  "Save the date and time of Your Appointment"       // 'Summary of your event'
                const eventDescription =  "Be Ready to consult with Dr.Aman within 15 mintues" // 'More description'
                const eventLocation =  "Online - Medicare "
                const mailtouser = appointment.patientId.email
                const mailtodoctor = appointment.doctorId.email

            
                console.log("appointment.date - ",startTime)

                //generatring ics object to send over mail....ics object which is a media type that allows users to store and exchange calendaring and scheduling information 
                const calenderObject = sendCalender.getIcalObjectInstance(startTime,endTime,eventSummary,eventDescription,eventLocation)
                sendCalender.sendInvitaion(calenderObject,mailtouser,mailtodoctor)
                  


               })
               res.render('aptStatus',{title:'Appointment Status',status:status})
             });
         });
  
         // post the data
         post_req.write(post_data);
         post_req.end();
        });
       
}