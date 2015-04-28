// 路由配置
var router = require('./router.js');

// 启动服务
var cluster = require('cluster');
if (cluster.isMaster) {
	var numCPUs = require('os').cpus().length;
	for (var i = 0; i < numCPUs; i++) {
		cluster.fork();
	}

	cluster.on('listening', function(worker, address) {
		console.log('Server is listening: pid=' + worker.process.pid + ', address=' + address.address + ":" + address.port);
	});

	cluster.on('exit', function(worker, code, signal) {
		console.error('Server exit: pid=' + worker.process.pid);
	});
} else {
	router.startServer();
}