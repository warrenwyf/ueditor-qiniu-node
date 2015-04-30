var options = require('./config.js').options;

var fs = require('fs');

var qiniu = require('qiniu');
qiniu.conf.ACCESS_KEY = options['qiniuAccessKey'];
qiniu.conf.SECRET_KEY = options['qiniuSecretKey'];

function listQiniu(params, callback) {
	var bucketname = options.qiniuBucket;

	var prefix = params['prefix'];
	var start = params['start'];
	var limit = params['limit'];

	qiniu.rsf.listPrefix(bucketname, prefix, null, 1000, function(err, ret) {
		if (err) {
			return callback(err);
		} else {
			var list = [];
			for (var i = start, j = start + limit; i < j; i++) {
				var item = ret.items[i];
				if (!item) {
					break;
				}
				console.log(item)
				var url = options['qiniuBucketUrl'] + item.key;
				list.push({
					'url': url,
					'mtime': item.putTime / 1e6
				});
			}

			return callback(null, {
				'start': start,
				'totle': list.length,
				'list': list,
				'state': 'SUCCESS'
			});
		}
	});
}

function fileToQiniu(params, callback) {
	var bucketname = options.qiniuBucket;
	var putPolicy = new qiniu.rs.PutPolicy(bucketname);
	var uptoken = putPolicy.token();
	var extra = new qiniu.io.PutExtra();

	var key = params['key'];
	var filePath = params['filePath'];
	var fileName = params['fileName'];

	qiniu.io.putFile(uptoken, key, filePath, extra, function(err, ret) {
		if (err) {
			return callback(err);
		} else {
			var url = options['qiniuBucketUrl'] + ret.key;
			return callback(null, {
				'url': url,
				'title': fileName,
				'state': 'SUCCESS'
			});
		}
	});
}

function dataToQiniu(params, callback) {
	var bucketname = options.qiniuBucket;
	var putPolicy = new qiniu.rs.PutPolicy(bucketname);
	var uptoken = putPolicy.token();
	var extra = new qiniu.io.PutExtra();

	var key = params['key'];
	var data = params['data'];

	qiniu.io.put(uptoken, key, data, extra, function(err, ret) {
		if (err) {
			return callback(err);
		} else {
			var url = options['qiniuBucketUrl'] + ret.key;
			return callback(null, {
				'url': url,
				'title': '',
				'state': 'SUCCESS'
			});
		}
	});
}


exports.listQiniu = listQiniu;
exports.fileToQiniu = fileToQiniu;
exports.dataToQiniu = dataToQiniu;