const { localsName } = require('ejs');
var checksum_lib = require('./Paytm/checksum');
const config = require('./Paytm/config');
const User = require('../models/user')
require('dotenv').config()
const https =  require("https")


module.exports.profile=function(req,res){

    console.log(process.env.PAYTM_MID)
    return res.render('profile', {
        title:"Patient Profile"
    })
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
        title:"Patient Sign IN"
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
            User.create({name:req.body.fname, email:req.body.email, password:req.body.pass}, function(err, user){
                if(err){req.flash('error', err); return}

                console.log('object is created');
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
    return res.redirect('/users/profile');
}



//destroy session for logout
module.exports.destroySession =function(req,res){
    req.logout();
    req.flash('success', 'You have logged out!');

    return res.redirect('/');
}



module.exports.consultDoctor =function(req,res){
    req.flash('success','Please a doctor to consult')

    return res.render('consult', {
        title:"Call Doctor"
    })
}

module.exports.callnow=function(req,res){
    res.send("Calling")
}

module.exports.payment =function(req,res){
    var paymentDetails = {
        amount: req.body.amount,
        customerId: req.user.id,
        customerEmail: req.user.email,
        customerPhone: 1234567890
    }
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
        params['CALLBACK_URL'] = 'http://localhost:8000/users/paytm/callback';
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
            
            //res.render('payment_refreshing',{title:'Merchant Checkout Page',form_fields: form_fields,txn_url:txn_url})
           res.writeHead(200, { 'Content-Type': 'text/html' });
            res.write('<html><head><title>Merchant Checkout Page</title></head><body><center><h1>Please do not refresh this page...</h1></center><form method="post" action="' + txn_url + '" name="f1">' + form_fields + '</form><script type="text/javascript">document.f1.submit();</script></body></html>');
            res.end();
        });
    }
}



module.exports.paymentCallback =function(req,res){
    // Route for verifiying payment
       var html = "";
       var post_data = req.body;
  
       // received params in callback
       console.log('Callback Response: ', post_data, "\n");
  
  
       // verify the checksum
       var checksumhash = post_data.CHECKSUMHASH;
       // delete post_data.CHECKSUMHASH;
       var result = checksum_lib.verifychecksum(req.body, config.PaytmConfig.key,checksumhash );
       console.log("Checksum Result => ", result, "\n");
  
  
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
  
  
         // Set up the request
         var response = "";
         var post_req = https.request(options, function(post_res) {
           post_res.on('data', function (chunk) {
             response += chunk;
           });
  
           post_res.on('end', function(){
             console.log('S2S Response: ', response, "\n");
  
             var _result = JSON.parse(response);
               if(_result.STATUS == 'TXN_SUCCESS') {
                   var status='payment sucess'
               }else {
                   var status='payment failed'
               }
               res.render('')
             });
         });
  
         // post the data
         post_req.write(post_data);
         post_req.end();
        });
       
}