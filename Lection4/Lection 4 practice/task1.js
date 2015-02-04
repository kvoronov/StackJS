var http = require('http');
var template = require('./template.js');
var fs = require('fs');
var qs = require('querystring');

// Load database module
var database = require('./database.js');

http.createServer(function(req, res){

    // split url to parts
    var params = req.url.split('/');

    // get cookie or array with empty string if cookie is not present
    var cookie = req.headers.cookie?req.headers.cookie.split('; ')[0].split('='):[''];

    // tranform cookie to more useful format if it's has correct format, and to null otherwise
    if(cookie[0]==='sessionId') {
        cookie = {
            sessionId: cookie[1]
        };
    }
    else cookie = null;

    if(req.method === 'GET'){
        // Handling GET requests

        if(params.length===2){
            // Handling url /login
            if(params[1]==='login'){
                database.sessions.getById(cookie.sessionId, function(err, session){
                    if(err) {
                        var stream = fs.createReadStream(__dirname + '/login.html');
                        stream.pipe(res);
                    } else {
                        res.writeHead(303, {
                            Location: '/profile' // if already logged in, redirect to /profile
                        });
                        res.end();
                    }
                });
            }
            // Handling url /profile
            else if(params[1]==='profile'){
                if(cookie){
                    database.sessions.getById(cookie.sessionId, function(err, session){
                        if(err) {
                            res.writeHead(303, {
                                Location: '/login' // if not logged in, redirect to /login
                            });
                            res.end();
                        } else {
                            // if logged in, get user from database
                            database.users.getById(session.userId, function(err, user){
                                if(err) {
                                    res.end(template.error(err));
                                } else {
                                    res.end(template.main(user)); // profile returned to user
                                }
                            });
                        }
                    });
                }
                else {
                    res.writeHead(303,{
                        Location: '/login'
                    });
                    res.end();
                }
            }
            // Handling url /style.css
            else if(params[1]==='style.css'){
                var stream = fs.createReadStream(__dirname+'/style.css');
                stream.pipe(res);
            }
            // Handling other urls
            else {
                res.writeHead(404);
                res.end(template.error({
                    error: '404 Page Not Found'
                }));
            }
        }
        // Handling other urls
        else {
            res.writeHead(404);
            res.end(template.error({
                error: '404 Page Not Found'
            }));
        }
    }
    else if(req.method == 'POST'){
        // Handling POST requests

        var formBody = '';
        req.on('data', function(data){
            formBody+=data;
        });
        req.on('end', function () {
            var formData = qs.parse(formBody);

            // Handling url /login
            if(params[1]==='login'){
                // Trying authentication
                database.users.auth(formData.login, formData.password, function(err){
                    if(err){
                        res.end(template.error(err));
                    } else {
                        // Authenticated successfully, creating new session
                        database.sessions.create(formData.login, function(err, sessionId){
                            if(err) {
                                res.end(template.error(err));
                            } else {
                                res.writeHead(303, {
                                    'Set-Cookie': 'sessionId='+sessionId, // setting sessionId to cookie
                                    Location: '/profile'                  // and redirecting user to /profile
                                });
                                res.end();
                            }
                        })
                    }
                })
            }
        });

    }
    else {
        // Handling all other requests with other HTTP methods
        res.writeHead(501);
        res.end('Not implemented');
    }

}).listen(8080);
