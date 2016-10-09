var path    = require("path");
var theDB = require("./db.js");
var mailer = require ("./mailer.js");
var uuid = require('node-uuid');

var PATH_TO_HTML = path.join(__dirname,'..');

var DB = new theDB('Ohel Shem');
var DBsnapshotInterval = DB.createDBSnapshotInterval(3000); 
var allowOrders = "enable";

exports.getMainPage = function(req, res){
	res.sendFile(path.join(PATH_TO_HTML, 'index.html'));
}

exports.getOrdersStop = function(req, res){
	console.log("returning allowOrders " + allowOrders)
	res.status(200).send(allowOrders);	
}

exports.stopOrders = function(req, res){
	var body = req.body;
	if (!body){
		res.status(400).send('Not a valid request!');
	}else{
		if (body.stopOrders === "disable"){
			console.log("Disabling orders!")
		}else if (body.stopOrders === "enable"){
			console.log("Enabling orders!")
		}
		allowOrders = req.body.stopOrders;
		res.status(200).send("done");	
	}
}

exports.makeOrder = function (req, res) {
	if (!validateOrderRequest(req)){
		console.log('Not a valid order!')
		res.status(400).send('Not a valid order!');
	}else{
		var order = req.body;
		order.id = uuid.v1();
		DB.saveOrder(order, function(err){
			if (err){
				res.status(500).send("Problem while trying to save order");
			}else{
				mailer.sendMail(createMailText(order), function(a){});
				res.status(200).send("done");	
			}
		});
	}
}

exports.getOrdersPage = function(req, res){
	res.sendFile(path.join(PATH_TO_HTML, 'orders.html'));
}

exports.getOrdersList = function(req, res){
	DB.getOrders(function(err,obj){
		if (err){
			res.status(500).send("Problem while trying to get orders");
		}else{
			res.status(200).send(obj);
		}	
	});
}

exports.updateOrder = function (req, res) {
	if (!validateOrderRequest(req)){
		console.log('Not a valid order!')
		res.status(400).send('Not a valid order!');
	}else{
		var onGetOrders = function(err,obj){
			if (err){
				res.status(500).send("Problem while trying to get orders");
			}else{
				updateOrderToDB(order, obj, res);
			}	
		}
		DB.getOrders(fileName, onGetOrders);
		
	}
}

function updateOrderToDB(order, orders, res){
	res.status(200).send("done");
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