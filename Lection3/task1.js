var http = require('http');
var template = require('./template.js');

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
            //var message = (err?JSON.stringify(err):JSON.stringify(data));
            var message = (err?template.error(err):template.main(data));
            res.end(message);
        });
    }
    else {
        res.writeHead(404);
        res.end(template.error({
            error: '404 Page Not Found'
        }));
    }

}).listen(8080);