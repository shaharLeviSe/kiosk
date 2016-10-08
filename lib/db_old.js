var jsonfile = require('jsonfile')

exports.saveOrder = function (order){
	var datetime = getDate();
	var fileName = __dirname+'/order_'+datetime+'.json'; 
	var orders;
	jsonfile.readFile(fileName, function(err, obj) {
		if (err){
			var newOrderList = createOrderList(order);
			saveToJsonFile(fileName, newOrderList);
		}else{
			orders = addToOrderList(obj, order);
			saveToJsonFile(fileName, orders);
		}
	})
}

function createOrderList(order){
	var orderList = [];
	orderList.push(order);
	return orderList;
}

exports.getOrders = function(fileName, cb){
	jsonfile.readFile(fileName, function(err, obj) {
		cb(err,obj);
	})
}

function addToOrderList(orderList, order){
	orderList.push(order);
	return orderList;
}

function saveToJsonFile(fileName, orderList){
	jsonfile.writeFile(fileName, orderList, {spaces: 2}, function(err) {
		if(err){
			console.error(err);
		}else{
			console.log("saved!");
		}
	})
}

function getDate(){
	var dateObj = new Date();
	var month = dateObj.getUTCMonth() + 1; //months from 1-12
	var day = dateObj.getUTCDate();
	var year = dateObj.getUTCFullYear();

	newdate =  day+ "-" + month + "-" + year;

	return newdate;
}