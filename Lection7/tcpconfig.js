module.exports = function(database, fs){
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
                            devicesConfig[device.type](socket, obj.data, device)
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