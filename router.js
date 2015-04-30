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

var moment = require('moment');
var randomstring = require("randomstring");
var store = require('./store.js');

//------------------------------------------
server.use(restify.queryParser());
server.use(restify.bodyParser());

server.get(/\/static\/?.*/, restify.serveStatic({
	directory: __dirname,
	default: 'index.html'
}));

server.get('/info', function(req, res, next) {
	res.send({
		version: options.version
	});

	return next();
});

server.get('/qiniu', function(req, res, next) {
	var params = req.params;

	var action = params['action'];

	if (action == 'config') {
		res.send(options.ueditorConfig);
	} else if (action == 'listimage' || action == 'listfile') {
		var start = parseInt(params['start'] || 0);
		var size = parseInt(params['size'] || 10);

		var storeParams = {
			prefix: action == 'listimage' ? 'image/' : 'file/',
			start: start,
			limit: size
		}

		store.listQiniu(storeParams, function(err, ret) {
			res.send(ret);
			return next();
		})

	} else {
		res.send();
	}

	return next();
});

server.post('/qiniu', function(req, res, next) {
	var params = req.params;

	var action = params['action'];

	var key = '/' + moment().format('YYYYMMDD') + '/' + (+new Date()) + randomstring.generate(6);
	switch (action) {
		case 'uploadvideo':
			key = 'video' + key;
			break;
		case 'uploadfile':
			key = 'file' + key;
			break;
		default:
			key = 'image' + key;
			break;
	}

	if (action == 'uploadimage' || action == 'uploadvideo' || action == 'uploadfile') {
		var file = req.files['upfile'];
		if (!file) {
			res.send();
			return next();
		}

		if (action == 'uploadfile') {
			key += '/' + file.name;
		}

		var storeParams = {
			key: key,
			filePath: file.path,
			fileName: file.name
		}

		store.fileToQiniu(storeParams, function(err, ret) {
			res.send(ret);
			return next();
		})
	} else if (action == 'uploadscrawl') {
		var data = req.params['upfile'];
		if (!data) {
			res.send();
			return next();
		}

		var storeParams = {
			key: key,
			data: new Buffer(data, 'base64')
		}

		store.dataToQiniu(storeParams, function(err, ret) {
			res.send(ret);
			return next();
		})
	}
});