module.exports = function(http, template){
    return function(config, port){
        return http.createServer(function(req, res){
            if(config[req.method]){

                // get cookie or array with empty string if cookie is not present
                var cookie = req.headers.cookie?req.headers.cookie.split('; ')[0].split('='):[''];

                // tranform cookie to more useful format if it's has correct format, and to null otherwise
                if(cookie[0]==='sessionId') {
                    cookie = {
                        sessionId: cookie[1]
                    };
                }
                else cookie = null;

                if(!(function(){
                        for(var i=0; i<config[req.method].length; i++){
                            var handler = config[req.method][i];
                            if(typeof handler.match==='string'){
                                if(handler.match===req.url){
                                    req.myCookie = cookie;
                                    handler.callback(req, res);
                                    return true;
                                }
                            } else if(typeof handler.match==='object'){
                                if(handler.match.test(req.url)){
                                    req.myCookie = cookie;
                                    handler.callback(req, res);
                                    return true;
                                }
                            } else if(typeof handler.match==='function'){
                                if(handler.match(req.url)){
                                    req.myCookie = cookie;
                                    handler.callback(req, res);
                                    return true;
                                }
                            }
                        }
                        return false;
                    })()){
                    res.writeHead(404);
                    res.end(template.error({
                        error: '404 Page Not Found'
                    }));
                }
            } else {
                // 501 not implemented
                res.writeHead(501);
                res.end('Not implemented');
            }
        }).listen(port);
    };
};