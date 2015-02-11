module.exports = function(database, fs, onlineDevices){
    var devicesConfig = {
        emergency: function(socket, data, device){
            if(data!==undefined){
                database.users.getById(device.userId, function(err, user){
                    if(err) {
                        socket.write(JSON.stringify({
                            error: err
                        })+'\n');
                    } else {
                        database.users.callEmergency(device.userId, function(err){
                            if(err) {
                                console.log(err);
                            } else {
                                console.log('Emergency called for '+user.firstName+' '+user.lastName);
                                socket.write(JSON.stringify({
                                    action: 'notify',
                                    data: 'Emergency called'
                                })+'\n');
                            }
                        });
                    }
                });
            }
        },
        coffeeMachine: function(socket, data, device){
            // coffee ready event
            if(typeof data==='object' && data!==null && data.status!==undefined){
                database.users.makeCoffee(device.userId, data.status, function(err){
                    if(err){
                        console.log(err);
                    }
                })
            }
        }
    };

    return [
        {
            match: function(obj){
                return obj.data!==undefined;
            },
            callback: function(obj, socket){
                database.devices.getById(obj.deviceId, function(err, device){
                    if(err){
                        socket.write(JSON.stringify({
                            error: 'Unknown device'
                        })+'\n');
                    } else {
                        if(devicesConfig[device.type]){
                            socket.deviceId = obj.deviceId;
                            onlineDevices[obj.deviceId] = socket;
                            devicesConfig[device.type](socket, obj.data, device);
                        } else {
                            socket.write(JSON.stringify({
                                error: 'Unknown device type'
                            })+'\n');
                        }
                    }
                });
            }
        }
    ]
}