module.exports = function(template, database, fs, qs){
    return {
        GET: [
            {
                match: '/login',
                callback: function(req, res){
                    var cookie = req.myCookie;
                    if(cookie){
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
                    } else{
                        var stream = fs.createReadStream(__dirname + '/login.html');
                        stream.pipe(res);
                    }
                }
            },
            {
                match: '/profile',
                callback: function(req, res){
                    var cookie = req.myCookie;
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
            },
            {
                match: '/style.css',
                callback: function(req, res){
                    var stream = fs.createReadStream(__dirname+'/style.css');
                    stream.pipe(res);
                }
            }
        ],
        POST: [
            {
                match: '/login',
                callback: function(req, res){
                    var formBody = '';
                    req.on('data', function(data){
                        formBody+=data;
                    });
                    req.on('end', function () {
                        var formData = qs.parse(formBody);

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
                    });
                }
            },
            {
                match: '/makemecoffee',
                callback: function(req, res){
                    var formBody = '';
                    req.on('data', function(data){
                        formBody+=data;
                    });
                    req.on('end', function () {
                        var formData = qs.parse(formBody);

                        var cookie = req.myCookie;
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
                                            // MAKE COFFEE
                                            if(user.coffeeMachineId!==undefined){
                                                database.devices.emit(user.coffeeMachineId,'coffee',{
                                                    temp: formData.temperature
                                                }, function(err){
                                                    if(err) {
                                                        res.end(template.error(err));
                                                    } else {
                                                        res.writeHead(303, {
                                                            Location: '/profile'
                                                        });
                                                        res.end();
                                                        //res.end(template.main(user)); // profile returned to user
                                                    }
                                                });
                                            } else {
                                                res.end(template.error({
                                                    error: 'User hasn\'t coffee machine'
                                                }));
                                            }
                                        }
                                    });
                                }
                            });
                        } else {
                            res.writeHead(303,{
                                Location: '/login'
                            });
                            res.end();
                        }
                    });
                }
            }
        ]
    };
};

