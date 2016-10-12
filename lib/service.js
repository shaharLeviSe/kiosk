var path = require("path");
var Logic = require("./logic");
var DB = require("./db.js");

var PATH_TO_HISTORY = path.join(__dirname,'..','history');

var Service = (function() {
	function Service(server) {
		this.server = server;
		this.db = new DB.DB('Ohel Shem');
		this.logic = new Logic.Logic(this.db);
	}

	Service.prototype.register = function() {
		var _this = this;
		this.server.get('/', function(req, res, next) {return _this.logic.getMainPage(req, res, next); });
		this.server.post('/order', function(req, res, next) {return _this.logic.makeOrder(req, res, next); });
		this.server.get('/orders', function(req, res, next) {return _this.logic.getOrdersPage(req, res, next); });
		this.server.get('/ordersList', function(req, res, next) {return _this.logic.getOrdersList(req, res, next); });
		this.server.post('/ordersList/stop', function(req, res, next) {return _this.logic.stopOrders(req, res, next); });
		this.server.get('/ordersList/stop', function(req, res, next) {return _this.logic.getOrdersStop(req, res, next); });
	};
	return Service;
}());
exports.Service = Service;