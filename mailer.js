var nodemailer = require('nodemailer');
var express = require("express");
var router = express.Router();

var transporter;
transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
            user: 'shahar.levi.se@gmail.com', // Your email id
            pass: '2357prime99' // Your password
        }
    }
    );


var mailOptions = {
    from: 'shahar.levi.se@gmail.com', // sender address
    to: 'shahar.levi.se@gmail.com', // list of receivers
    subject: 'New Order', // Subject line
    //text: text //, // plaintext body
    // html: '<b>Hello world ✔</b>' // You can choose to send an HTML body instead
};

exports.sendMail = function(text, cb){
    // mailOptions.text = text;
    // try{
    //     transporter.sendMail(mailOptions, function(error, info){
    //         if(error){
    //             console.log("Unable to send mail. Error: ");
    //             console.log(error);
    //             cb(error);
    //         }else{
    //             console.log('Message sent: ' + info.response);
    //             cb(info);
    //         };
    //     });
    // }catch(e){
    //     console.log(e);
    //     cb(e);
    // }
}