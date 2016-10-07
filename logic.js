var path    = require("path");
var jsonfile = require('jsonfile')
var db = require ("./db.js");
var mailer = require ("./mailer.js");
var uuid = require('node-uuid');

exports.getMainPage = function(req, res){
	res.sendFile(path.join(__dirname +'/index.html'));
}

exports.makeOrder = function (req, res) {
	if (!validateOrderRequest(req)){
		console.log('Not a valid order!')
		res.status(400).send('Not a valid order!');
	}else{
		var order = req.body;
		order.id = uuid.v1();
		db.saveOrder(order);
		mailer.sendMail(createMailText(order), function(a){});
		res.status(200).send("done");
	}
}

function updateOrderToDB(order, orders, res){
	res.send("done");
}

exports.updateOrder = function (req, res) {
	if (!validateOrderRequest(req)){
		console.log('Not a valid order!')
		res.status(400).send('Not a valid order!');
	}else{
		var fileName = __dirname+'/order_'+day+'.json';	
		var onGetOrders = function(err,obj){
			if (err){
				res.status(500).send("Can't access file " + fileName);
			}else{
				updateOrderToDB(order, obj, res);
				res.status(200).send(obj);
			}	
		}
		db.getOrders(fileName, onGetOrders);
		
	}
}

exports.getOrdersPage = function(req, res){
	res.sendFile(path.join(__dirname +'/orders.html'));
}

exports.getOrdersList = function(req, res){
	var day = req.param('date');
	var fileName = __dirname+'/order_'+day+'.json';
	var onGetOrders = function(err,obj){
		if (err){
			res.status(500).send("Can't access file " + fileName);
		}else{
			res.status(200).send(obj);
		}	
	} 

	db.getOrders(fileName, onGetOrders);
}

function createMailText(order){
	var text ="id: "+order.id+"\n"; 
	text += "שם: "+order.name+"\n";
	text += "טלפון: "+order.phone+"\n";
	text += "הזמנה:\n"+order.info+"\n";
	text += "הערות:\n"+order.comments+"\n";
	
	return text;
}

function validateOrderRequest(req){
	if (req == null || req.body == null){
		return false;
	}

	var order = req.body;
	if (!order.phone || !order.pname || !order.fname || !order.info){
		return false;
	}

	return true;
}