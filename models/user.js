var mongoose = require('mongoose'),
	schema = mongoose.Schema;

var userSchema = schema ({
	name: String,
	username: String,
	id: String,
	accessToken: String,
	bio: String,
	profileImage: String
});

module.exports = userSchema;