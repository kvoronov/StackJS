var net = require('net');

net.createServer(function(socket){
    socket.pipe(process.stdout);
    socket.pipe(socket);
}).listen(8080);