module.exports = function(app, router){
	
	var User     = require('./../models/user');
	var fields 	 = [':username', ':firstName', ':lastName', 'registrationId', 'registrationExpireAt', 'registrationStartAt', 'gender', 'photo'];

	router.route('/users/:user_id')
	
		// get the bear with that id (accessed at GET http://localhost:8080/api/bears/:bear_id)
		.get(function(req, res) {
			User.findById(req.params.user_id, function(err, user) {
				if (err)
					res.send(err);
				
				res.json(user);
			});
		})
		
		// update the bear with this id (accessed at PUT http://localhost:8080/api/bears/:bear_id)
		.put(function(req, res) {

			// use our bear model to find the bear we want
			User.findById(req.params.user_id, function(err, user) {
				console.log(req);

				if (err)
					res.send(err);
					
				for(var key in fields) {
			
					var field = fields[key];
					
					if (field.charAt(0) == ':')
						field = field.substr(1);
					
					if (typeof req.body[field] != "undefined")
						user[field] = req.body[field]
				
				}

				// save the bear
				user.save(function(err) {
					if (err) {
						res.send(err);
						console.log('error');
					} else {
						res.json({ message: 'User updated!' });
					}
				});

			});
		})
		
		// delete the bear with this id (accessed at DELETE http://localhost:8080/api/bears/:bear_id)
		.delete(function(req, res) {
			User.remove({
				_id: req.params.user_id
			}, function(err, user) {
				if (err)
					res.send(err);

				res.header('Access-Control-Allow-Origin', req.headers.origin);
				res.json({ message: 'Successfully deleted' });
			});
		});
		
		
	router.route('/users')

		// create a bear (accessed at POST http://localhost:8080/api/bears)
		.post(function(req, res) {
			
			var user = new User(); 		// create a new instance of the Bear model
					
			for(var key in fields) {
			
				var field = fields[key];
				
				if (field.charAt(0) == ':') {
					
					field = field.substr(1);
					
					if (typeof req.body[field] == "undefined"){
						res.send(400, {message: "Undefined required field '" + field + "'"});
					}
					
				}
				
				if (typeof req.body[field] != "undefined")
					user[field] = req.body[field]
				
			}

			// save the bear and check for errors
			user.save(function(err) {
				if (err)
					res.send(err);

				res.header('Access-Control-Allow-Origin', req.headers.origin);
				res.json({ 
					message: 'User created!',
					userId: user._id
				});
			});
			
		})
		
		.get(function(req, res) {
			User.find(function(err, users) {
				if (err)
					res.send(err);

				res.header('Access-Control-Allow-Origin', req.headers.origin);
				res.json(users);
			});
		});

}
