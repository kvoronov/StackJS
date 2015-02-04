module.exports = {
        main: function(data){
                return '<html>'+
                    '<head>'+
                        '<link rel="stylesheet" href="/style.css"/>'+
                    '</head>'+
                    '<body>'+
                        '<div class="header">User profile</div>'+
                        '<div class="main">'+
                            '<div><b>First name:</b> '+data.firstName+'</div>'+
                            '<div><b>Last name:</b> '+data.lastName+'</div>'+
                            '<div><b>Age:</b> '+data.age+'</div>'+
                        '</div>'+
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