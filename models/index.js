var mongoose = require('mongoose'),
	userSchema = require('./user'),
	conf = require('../conf')

var uri = conf.mongo_uri;

console.log(uri);

mongoose.connect(uri);

module.exports.User = mongoose.model('user', userSchema);