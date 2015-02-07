var net = require('net');
var fs = require('fs');
var qs = require('querystring');
var http = require('http');
var template = require('./template.js');
var mongojs = require('mongojs');
var db = mongojs('stackjs', ['users', 'devices', 'sessions']);
var database = require('./database.js')(db);
var fs = require('fs');
var tcpconfig = require('./tcpconfig.js')(database, fs);
var tcprouter = require('./tcprouter.js')(net);
var config = require('./config.js')(template, database, fs, qs);
var router = require('./router.js')(http, template);

router(config, 8080);
tcprouter(tcpconfig, 8081);