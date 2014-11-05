module.exports = function(app, router){
	
	var Club     = require('./../models/club');
	
	var fields = ['title', 'city', 'photo'];

	router.route('/clubs/:club_id')

		// get the bear with that id (accessed at GET http://localhost:8080/api/bears/:bear_id)
		.get(function(req, res) {
			Club.findById(req.params.club_id, function(err, club) {
				if (err)
					res.send(err);
				
				res.json(club);
			});
		})
		
		// update the bear with this id (accessed at PUT http://localhost:8080/api/bears/:bear_id)
		.put(function(req, res) {

			// use our bear model to find the bear we want
			Club.findById(req.params.club_id, function(err, club) {

				if (err)
					res.send(err);

				for(var key in fields) {
			
					var field = fields[key];
					
					if (field.charAt(0) == ':')
						field = field.substr(1);
					
					if (typeof req.body[field] != "undefined")
						club[field] = req.body[field]
				
				}

				// save the bear
				club.save(function(err) {
					if (err)
						res.send(err);

					res.json({ message: 'Club updated!' });
				});

			});
		})
		
		// delete the bear with this id (accessed at DELETE http://localhost:8080/api/bears/:bear_id)
		.delete(function(req, res) {
			Club.remove({
				_id: req.params.club_id
			}, function(err, club) {
				if (err)
					res.send(err);

				res.json({ message: 'Successfully deleted' });
			});
		});
		
		
	router.route('/clubs')

		// create a bear (accessed at POST http://localhost:8080/api/bears)
		.post(function(req, res) {
			
			var club = new Club(); 		// create a new instance of the Bear model
			club.title = req.body.title;  // set the bears name (comes from the request)
			club.city = req.body.city;  // set the bears name (comes from the request)

			// save the bear and check for errors
			club.save(function(err) {
				if (err)
					res.send(err);

				res.json({ 
					message: 'Club created!',
					clubId: club._id
				});
				
			});
			
		})
		
		.get(function(req, res) {
			Club.find(function(err, clubs) {
				if (err)
					res.send(err);

				res.json(clubs);
			});
		});

}
