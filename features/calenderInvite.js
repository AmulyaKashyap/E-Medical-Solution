//for generating calender object to send over mail
const ical = require('ical-generator');
//for sending mail 
var nodemailer = require("nodemailer");
//const moment= require('moment') 
require('dotenv').config()



function getIcalObjectInstance(startTime,endTime,eventSummary,eventDescription,eventLocation) {
    const cal = ical({ name: 'Medicare' });
    cal.createEvent({
            start: startTime,         // eg : moment()
            end: endTime,             // eg : moment(1,'days')
            summary: eventSummary,         // 'Summary of your event'
            description: eventDescription, // 'More description'
            location: eventLocation,       // 'Delhi'
            url: "http://localhost:8000/users/profile",                 // 'event url'
            organizer: {              // 'organizer details'
                name: "Medicare",
                email: "pachouriaman679@gmail.com"
            },
        });
    return cal;
}

    
function sendInvitaion(calendarObj,mailtouser,mailtodoctor){
    var smtpTransport = nodemailer.createTransport({
        service: "Gmail",
        auth: {
            user: "pachouriaman679@gmail.com",//process.env.GMAIL_ACCOUNT,//
            pass: "mnblkjpoi123"//process.env.GMAIL_ACCOUNT//
        }
    });
        mailOptions = {
            to: mailtouser,
            cc:mailtodoctor,
            subject: 'Booking Confirmed With Medicare',
            html: '<h1>Welcome to Medicare</h1></br><h2>Please Explore our service</h2>'
        }
    if (calendarObj) {
            let alternatives = {
                "Content-Type": "text/calendar",
                "method": "REQUEST",
                "content": Buffer.from(calendarObj.toString()),
                "component": "VEVENT",
                "Content-Class": "urn:content-classes:calendarmessage"
            }
    mailOptions['alternatives'] = alternatives;
    mailOptions['alternatives']['contentType'] = 'text/calendar'
    }
    smtpTransport.sendMail(mailOptions, function (error, response) {
            if (error) {
                console.log("error - ",error);
            } else {
                console.log("Message sent");
            }
        })
}


module.exports.getIcalObjectInstance = getIcalObjectInstance
module.exports.sendInvitaion = sendInvitaion
