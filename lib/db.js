var jsonfile = require('jsonfile');
var path = require("path");
var PATH_TO_HISTORY = path.join(__dirname, '..', 'history');
var fs = require("fs");

var DB = (function () {
	function DB(name) {
		this.customer = name;
		this.db = {};
	};

	DB.prototype.initialize = function () {
		var datetime = getDate();
		var fileName = path.join(PATH_TO_HISTORY, 'order_' + datetime + '.json');
		if (fs.existsSync(fileName)) {
			console.log("Reading rders from file '"+fileName+"'");
			this.db = jsonfile.readFileSync(fileName);
		}
	}

	DB.prototype.saveOrder = function (order, callback) {
		if (this.db[order.phone]) {
			this.addOrderToPhone(order);
		} else {
			this.db[order.phone] = createOrderDoc(order);
		}

		callback(null);
	};

	DB.prototype.getOrders = function (callback) {
		callback(null, this.parseDBToArray());
	};

	DB.prototype.getOrdersAsArray = function (callback) {
		callback(null, this.parseDBToArray());
	};

	DB.prototype.updateStatus = function (phone, status, price, callback) {
		if (!this.db[phone]) {
			console.error("phone '" + phone + "' is not in the database!");
			callback("bad");
		}
		else {
			this.db[phone].status = status;
			this.db[phone].price = price;
		}
		callback(null);
	};

	DB.prototype.createDBSnapshotInterval = function (delay) {
		var _this = this;
		return setInterval(function () {
			var datetime = getDate();
			var fileName = path.join(PATH_TO_HISTORY, 'order_' + datetime + '.json');
			jsonfile.writeFile(fileName, _this.db, { spaces: 2 }, function (err) {
				if (err) {
					console.error(err);
				} else {
					console.log("Saved orders to '" + fileName + "'");
				}
			})
		}, delay);
	};

	DB.prototype.addOrderToPhone = function (order) {
		var orderInfo = createInfoObj(order);
		this.db[order.phone].info.push(orderInfo);
		this.db[order.phone].status = "open";
	};

	DB.prototype.parseDBToArray = function () {
		var theDB = this.db;
		var returnedArray = [];
		for (var phone in theDB) {
			if (theDB.hasOwnProperty(phone)) {
				returnedArray.push(theDB[phone]);
			}
		}
		returnedArray = sortArrayByTimestampAscending(returnedArray);
		return returnedArray;
	};
	return DB;
} ());
exports.DB = DB;

function createOrderDoc(order) {
	var now = Date.now();
	return {
		id: order.id,
		pname: order.pname,
		fname: order.fname,
		info: [createInfoObj(order)],
		phone: order.phone,
		timestamp: now,
		status: order.status || 'open'
	};
}

function createInfoObj(order) {
	return {
		info: order.info,
		comments: order.comments
	};
}

function sortArrayByTimestampAscending(array) {
	array.sort(function (a, b) {
		return a.timestamp - b.timestamp;
	});

	return array;
}

function getDate() {
	var dateObj = new Date();
	var month = dateObj.getUTCMonth() + 1; //months from 1-12
	var day = dateObj.getUTCDate();
	var year = dateObj.getUTCFullYear();

	newdate = day + "-" + month + "-" + year;

	return newdate;
}