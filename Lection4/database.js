// Module that realises database interface

// "Private" in module var storage - in-memory database
var storage = {
    users: {
        'id1': {
            firstName: 'Vasily',
            lastName: 'Pupkin',
            age: 20,
            password: '123'
        },
        id2: {
            firstName: 'Petr',
            lastName: 'Pepkin',
            age: 32,
            password: 'abc'
        }
    },
    sessions: []
};

// Object implementing database interface
var database = {

    sessions: {
        // Creates session using userId(userId is the same as login)
        // id of created session returns to callback
        create: function(userId, callback){
            database.users.getById(userId, function(err, user){
                if(err) {
                    callback(err);
                } else {
                    storage.sessions.push({
                        sessionId: storage.sessions.length.toString(),
                        userId: userId
                    });
                    callback(null,
                        storage.sessions[storage.sessions.length-1].sessionId);
                }
            });
        },
        // get session object by sessionId or error if session is invalid
        getById: function(sessionId, callback){
            if(storage.sessions[sessionId]) {
                callback(null, storage.sessions[sessionId]);
            } else {
                callback({
                    error: "Invalid session"
                });
            }
        }
    },

    users: {
        // get user object by userId(login) or error if user not exists
        getById: function(userId, callback){
            if(storage.users[userId]) {
                callback(null, storage.users[userId]);
            } else {
                callback({
                    error: 'User not exists'
                });
            }
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
        }
    }
};

// return database object as module
module.exports = database;