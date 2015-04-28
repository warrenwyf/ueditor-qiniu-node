var options = require('./config.js').options;

// REST服务
var restify = require('restify');
var server = restify.createServer();
exports.startServer = function(port, callback) {
	server.listen(port ? port : options.port, callback);
};
exports.stopServer = function(callback) {
	server.close(callback);
};

//------------------------------------------
server.use(restify.queryParser());

server.get('/info', function(req, res, next) {
	res.send({
		version: options.version
	});

	return next();
});