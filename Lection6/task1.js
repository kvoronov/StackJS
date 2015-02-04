var net = require('net');
var database = require('./database.js');
var fs = require('fs');
var config = require('./config.js')(database, fs);
var router = require('./tcprouter.js')(net);

router(config, 8080);