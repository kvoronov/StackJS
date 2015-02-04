var http = require('http');
var template = require('./template.js');
var fs = require('fs');
var qs = require('querystring');

var database = require('database.js');

http.createServer(function(req, res){

    // /getprofile/:id
    var params = req.url.split('/');

    var cookie = req.headers.cookie.split('; ')[0].split('=');
    if(cookie[0]==='sessionId'){
        cookie = {
            sessionId: cookie[1]
        };
        database.getUserBySession(cookie.sessionId, function(err, user){
            if(err){
                res.end(template.error(err));
            }
            else {
                if(params[1]==='login'){
                    req.writeHead(303, {
                        Location: '/profile'
                    });
                    res.end();
                }
                else if(params[1]==='profile'){
                    res.end(template.main(user));
                }
                else {
                    if(params.length===2){
                        if(params[1]==='login'){
                            if(req.method==='GET'){
                                var stream = fs.createReadStream(__dirname+'/login.html');
                                stream.pipe(res);
                            }
                            else {
                                var formBody = '';
                                req.on('data', function(data){
                                    formBody+=data;
                                });
                                req.on('end', function () {
                                    var formData = qs.parse(formBody);
                                    res.end(JSON.stringify(formData));
                                });

                            }
                        }
                        else if(params[1]==='profile'){
                            database.getUserBySession()
                        }
                        else if(params[1]==='style.css'){
                            var stream = fs.createReadStream(__dirname+'/style.css');
                            stream.pipe(res);
                        }
                    }

                    else if(params.length===3 && params[1]==='getprofile'){
                        var id = params[2];
                        database.getData(id, function(err, data){
                            //var message = (err?JSON.stringify(err):JSON.stringify(data));
                            var message = (err?template.error(err):template.main(data));
                            res.end(message);
                        });
                    }
                    else {
                        res.writeHead(404);
                        res.end(template.error({
                            error: '404 Page Not Found'
                        }));
                    }
                }
            }
        });
    }
    else {
        // invalid cookie
        if(params[1]==='profile'){
            //req.end(template.error({
            //    error: 'Invalid cookie'
            //}));
            res.writeHead(303, {
                Location: '/login'
            });
            res.end();
            return;
        }
    }

}).listen(8080);
