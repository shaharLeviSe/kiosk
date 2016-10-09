var express = require("express");
var app = express();
var logic = require("./lib/logic.js");
var bodyParser = require('body-parser');

app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/static'));

app.get('/', logic.getMainPage);

app.post('/order', logic.makeOrder);
app.get('/orders', logic.getOrdersPage);
app.get('/ordersList', logic.getOrdersList);
app.post('/ordersList/stop', logic.stopOrders)
app.get('/ordersList/stop', logic.getOrdersStop)
console.log("starting server on port 3000..");
app.listen(3000);