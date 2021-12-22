const config = require('../controllers/Paytm/config')
var checksum_lib = require('../controllers/Paytm/checksum')
const https =  require("https")

function sendResponseToPaytm(paymentDetails,res){

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

function receivedResponseFromPaytm(req){
           // Route for verifiying payment
           var html = "";
           var message="";
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
                hostname: 'securegw-stage.paytm.in',     // for staging
                //hostname: 'securegw.paytm.in',          // for production
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
                    console.log("from paytm - ",_result)
                    message = {transactionId:_result.TXNID,transactionStatus:_result.STATUS}
                    });
                });
                // post the data
                post_req.write(post_data);
                post_req.end();
                return message

        });

}


module.exports.sendResponseToPaytm = sendResponseToPaytm;

