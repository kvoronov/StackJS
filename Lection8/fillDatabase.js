var mongojs = require('mongojs');
var db = mongojs('stackjs', ['users', 'devices', 'sessions']);

db.users.drop(function () {
    db.devices.drop(function(){
        db.sessions.drop(function(){
            db.users.insert({
                firstName: 'Vasily',
                lastName: 'Pupkin',
                age: 20,
                password: '123',
                id: 'id1',
                coffeeMachineId: 'device2'
            }, function(){
                db.users.insert({
                    firstName: 'Petr',
                    lastName: 'Pepkin',
                    age: 32,
                    password: 'abc',
                    id: 'id2'
                }, function(){
                    db.devices.insert({
                        type: 'emergency',
                        userId: 'id1',
                        id: 'device1'
                    }, function(){
                        db.devices.insert({
                            type: 'coffeeMachine',
                            userId: 'id1',
                            id: 'device2'
                        }, function(){
                            db.close();
                        })
                    })
                })
            })
        })
    })
})

//var storage = {
//    users: {
//        'id1': {
//            firstName: 'Vasily',
//            lastName: 'Pupkin',
//            age: 20,
//            password: '123'
//        },
//        id2: {
//            firstName: 'Petr',
//            lastName: 'Pepkin',
//            age: 32,
//            password: 'abc'
//        }
//    },
//    devices: {
//        device1: {
//            type: 'emergency',
//            userId: 'id1'
//        }
//    }
//};