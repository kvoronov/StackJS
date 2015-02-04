module.exports = {
        main: function(data){
                return '<html>'+
                    '<head></head>'+
                    '<body>'+
                    '<div>First name: '+data.firstName+'</div>'+
                    '<div>Last name: '+data.lastName+'</div>'+
                    '<div>Age: '+data.age+'</div>'+
                    '</body>'+
                    '</html>';
        },
        error: function(data){
                return '<html>'+
                    '<head></head>'+
                    '<body>'+
                    '<div>Error: '+data.error+'</div>'+
                    '</body>'+
                    '</html>';
        }
};