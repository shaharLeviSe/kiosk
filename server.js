var express = require("express");
var server = express();
var Service = require("./lib/service.js");
var bodyParser = require('body-parser');

server.use(bodyParser.json()); // to support JSON-encoded bodies
server.use(bodyParser.urlencoded({ extended: true }));
server.use(express.static(__dirname + '/static'));

var kioskService = new Service.Service(server);
kioskService.register();

console.log("starting server on port 3000..");
server.listen(3000);