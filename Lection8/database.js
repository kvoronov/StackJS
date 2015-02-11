// Module that realises database interface

module.exports = function(db, onlineDevices){
    // Object implementing database interface

    function guid(){
        return Math.floor(Math.random()*1000000000).toString();
    }

    function createSession(userId, callback){
        var newSessionId = guid();
        db.sessions.findOne({
            id: newSessionId
        }, function(err, session){
            if(err){
                callback({
                    error: 'Database error'
                });
            } else if(session!==null){
                createSession(userId, callback);
            } else {
                db.sessions.insert({
                    id: newSessionId,
                    userId: userId
                }, function(err, session){
                    if(err || session===null){
                        callback({
                            error: 'Database error'
                        });
                    } else {
                        callback(null, session.id);
                    }
                })
            }
        })
    }

    var database = {
        sessions: {
            // Creates session using userId(userId is the same as login)
            // id of created session returns to callback
            create: createSession,
            // get session object by sessionId or error if session is invalid
            getById: function(sessionId, callback){
                db.sessions.findOne({
                    id: sessionId
                }, function(err, session){
                    if(err) {
                        callback({
                            error: 'Database error'
                        });
                    } else if(session===null){
                        callback({
                            error: "Invalid session"
                        });
                    } else {
                        callback(null, session)
                    }
                });
            }
        },

        devices: {
            getById: function(deviceId, callback){
                db.devices.findOne({
                    id: deviceId
                }, function(err, device){
                    if(err){
                        callback({
                            error: "Database error"
                        });
                    } else if(device===null){
                        callback({
                            error: "Unknown device"
                        });
                    } else {
                        callback(null, device);
                    }
                });
            },

            emit: function(deviceId, action, data, callback){
                if(onlineDevices[deviceId]===undefined){
                    callback({
                        error: "Device is not online"
                    })
                } else {
                    onlineDevices[deviceId].write(JSON.stringify({
                        action: action,
                        data: data
                    })+'\n');
                    callback(null);
                }
            }
        },

        users: {
            // get user object by userId(login) or error if user not exists
            getById: function(userId, callback){
                db.users.findOne({
                    id: userId
                }, function(err, user){
                    if(err){
                        callback({
                            error: "Database error"
                        });
                    } else if(user===null){
                        callback({
                            error: "User not exists"
                        });
                    } else {
                        callback(null, user);
                    }
                });
            },
            // if user exists and password correct, return null as error to callback
            auth: function(userId, password, callback){
                database.users.getById(userId, function(err, user){
                    if(err){
                        callback(err);
                    } else {
                        if(user.password===password) {
                            callback(null);
                        } else {
                            callback({
                                error: 'Invalid password'
                            })
                        }
                    }
                });
            },
            callEmergency: function(userId, callback){
                db.users.update({
                    id: userId
                }, {
                    $set: {
                        emergencyCalled: (new Date()).toUTCString()
                    }
                }, function(err){
                    if(err){
                        callback({
                            error: 'Database error'
                        });
                    } else {
                        callback(null);
                    }
                })
            },
            makeCoffee: function(userId, coffeeStatus, callback){
                database.users.getById(userId, function(err, user){
                    if(err){
                        callback(err);
                    } else {
                        if(user.coffeeMachineId!==undefined){
                            db.users.update({
                                id: userId
                            }, {
                                $set: {
                                    coffeeStatus: coffeeStatus
                                }
                            }, function(err){
                                if(err){
                                    callback({
                                        error: 'Database error'
                                    });
                                } else {
                                    callback(null);
                                }
                            })
                        } else {
                            callback({
                                error: "User hasn't coffee machine"
                            })
                        }
                    }
                })
            }

        }
    };

    return database;
};