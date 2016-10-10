var jsonfile = require('jsonfile');
var path = require("path");
var Logic = require("./logic.js");
var DB = require("./db.js");

var PATH_TO_HISTORY = path.join(__dirname,'..','history');

function Service(server) {
	this.server = server;
	this.db = new DB('Ohel Shem');
	this.logic = new Logic(this.db);
}

Service.prototype.register = function() {
	this.server.get('/', this.logic.getMainPage);
	this.server.post('/order', this.logic.makeOrder);
	this.server.get('/orders', this.logic.getOrdersPage);
	this.server.get('/ordersList', this.logic.getOrdersList);
	this.server.post('/ordersList/stop', this.logic.stopOrders);
	this.server.get('/ordersList/stop', this.logic.getOrdersStop);
}

module.exports = Service;