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
    devices: {
        device1: {
            type: 'emergency',
            userId: 'id1'
        }
    }
};

// Object implementing database interface
var database = {

    devices: {
        getById: function(deviceId, callback){
            if(storage.devices[deviceId]) {
                callback(null, storage.devices[deviceId]);
            } else {
                callback({
                    error: "Unknown device"
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