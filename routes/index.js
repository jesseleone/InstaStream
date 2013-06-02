
/*
 * GET home page.
 */

var ig = require('instagram-node').instagram();
var conf = require('../conf');
var db = require('../models');

ig.use(conf.instagram);

module.exports = function(app) {
	app.get('/', function(req, res) {
		res.render('index', { title: 'Instastream'})
	});

	app.get('/explore', function(req, res) {
		ig.media_popular(function(err, medias,limit) {
			if (err) {
				console.log(err);
			}
			res.render('explore', {
				title: 'explore',
				medias: medias
			});
		});
	});

	app.get('/location/:latitude/:longitude', function(req, res) {
		var lat = Number(req.param('latitude'));
		var lng = Number(req.param('longitude'));

		ig.media_search(lat, lng, function(err, medias, limit) {
			if(err) {
				console.log(err);
			}
			res.render('location', {
				title: 'location',
				medias: medias,
				lat: lat,
				lng: lng
			});
		});
	});

	app.get('/authorize', function(req, res) {
		res.redirect(ig.get_authorization_url('http://localhost:3000/handleAuth', { scope: ['basic'], state: 'a state'}))
	});

	app.get('/handleAuth', function(req, res) {
		ig.authorize_user(req.query.code, 'http://localhost:3000/handleAuth', function(err, result) {
			if (err) {
				console.log(err);
				return res.send('Authorization failure');
			}

			console.log(result);

			var username = result.user.username;
			var name = result.user.full_name;
			var access_token = result.access_token;
			var bio = result.user.bio;
			var profile_picture = result.user.profile_picture;
			var id = result.user.id;

			db.user.findOne({username: username}, function(err, user) {
				if (!user) {
					user = new db.user();
					user.username = username;
				}

				user.bio = bio;
				user.accessToken = access_token;
				user.profileImage = profile_picture;
				user.id = id;

				user.save(function(err) {
					if (err) {
						console.log(err);
					}

					res.session.user = user;

					res.redirect('/followers');
				});
			});

		});
	});

	app.get('/followers', function(req, res) {
		var user = req.session.user;

		ig.user_followers(user.id, function(err, followers) {
			console.log(require('util').inspect(followers));

			ig.user_follows(user.id, function(err, follows) {
				console.log(require('util').inpect(follows));

				res.send('ok');
			});
		});
	});

}