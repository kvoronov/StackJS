var http = require('http');

var database = {
    storage: {
        'id1': {
            firstName: 'Vasily',
            lastName: 'Pupkin',
            age: 20
        },
        id2: {
            firstName: 'Petr',
            lastName: 'Pepkin',
            age: 32
        }
    },
    getData: function(id, callback){
        if(database.storage[id]===undefined){
            setTimeout(function(){
                callback({
                    error: 'User not found'
                });
            }, 500)
        }
        else {
            setTimeout(function(){
                callback(null, database.storage[id]);
            }, 1500)
        }
    }
}

http.createServer(function(req, res){

    // /getprofile/:id

    var params = req.url.split('/');
    if(params.length===3 && params[1]==='getprofile'){
        var id = params[2];
        database.getData(id, function(err, data){
            var message = (err?JSON.stringify(err):JSON.stringify(data));
            res.end(message);
        });
    }
    else {
        res.writeHead(404);
        res.end('404');
    }

    //res.end('Hello World!\n'+req.url);
    //database.getData(req.url, function(err, data){
    //    if(err) res.end('Invalid request');
    //    else res.end(data);
    //});
}).listen(8080);

// ps -eo pid,args --forest | grep "node"
// kill -9 <number>