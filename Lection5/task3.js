var http = require('http');
var template = require('./template.js');
var database = require('./database.js');
var fs = require('fs');
var qs = require('querystring');
var config = require('./config.js')(template, database, fs, qs);
var router = require('./router.js')(http, template);

router(config, 8080);