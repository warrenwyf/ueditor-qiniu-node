var testPort = 4000;
require('./router.js').startServer(testPort);


var restify = require('restify');
var client = restify.createJsonClient({
	url: 'http://localhost:' + testPort
});

var options = require('./config.js').options;

exports.testInfo = function(test) {
	client.get('/info', function(err, req, res, obj) {
		test.ifError(err);

		test.equal(res['version'], options.version);

		test.done();
	});
};