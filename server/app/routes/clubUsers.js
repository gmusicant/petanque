module.exports = function(app, router){
	
	var User     = require('./../models/user');
	var Club     = require('./../models/club');		
	
	var fields 	 = [':userId', ':clubId'];
		
	router.route('/clubUsers/:clubId/user/:userId')		
		.delete(function(req, res) {
			
			User.findById(req.params.userId, function(err, user) {
					
				if (err) {
					res.send(err);
				} else {
									
					if (user.clubId == req.params.clubId) {
						
						user.clubId = '';
				
						user.save(function(err) {
							if (err)
								res.send(err);

							res.json({ message: 'User created!' });
						});
						
					} else 
						res.json({ message: 'Club desn\'t exists!' });
						
				}
					
			});
				
		});
		
		
	router.route('/clubUsers/:clubId')
		.get(function(req, res) {
			
			User.find({clubId:req.params.clubId}, function(err, users) {
					
				if (err) {
					res.send(err);
				} else {
					res.json(users);
				}
					
			});
			
		});
	
	
	router.route('/clubUsers')

		// create a bear (accessed at POST http://localhost:8080/api/bears)
		.post(function(req, res) {
			
			for(var key in fields) {
			
				var field = fields[key];
				
				if (field.charAt(0) == ':') {
					
					field = field.substr(1);
					
					if (typeof req.body[field] == "undefined")	{
						res.send(400, {message: "Undefined required field '" + field + "'"});
					}
					
				}
				
			}
			
			Club.findById(req.body.clubId, function(err, club) {
				
				if (err)
					res.send(err);
					
				User.findById(req.body.userId, function(err, user) {
					
					if (err)
						res.send(err);
				
					if (user.clubId != req.body.clubId) {
						
						user.clubId = req.body.clubId;
					
						user.save(function(err) {
							if (err)
								res.send(err);

							res.json({ message: 'User created!' });
						});
						
					} else 
						res.json({ message: 'Club already exists!' });
						
				});
				
			});
			
		});

}
