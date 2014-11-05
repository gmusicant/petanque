module.exports = function(app, router){
	
	var Tornament     = require('./../models/tornament');
	var fields 	 = [':title', 'description', ':type', 'photo', 'startDate', 'registrationTillDate', 'inscriptionDate', 'price', 'currency', 'prize'];

	router.route('/tornament/:tornament_id')
	
		// get the bear with that id (accessed at GET http://localhost:8080/api/bears/:bear_id)
		.get(function(req, res) {
			Tornament.findById(req.params.tornament_id, function(err, tornament) {
				if (err)
					res.send(err);
				
				res.json(tornament);
			});
		})
		
		// update the bear with this id (accessed at PUT http://localhost:8080/api/bears/:bear_id)
		.put(function(req, res) {

			// use our bear model to find the bear we want
			Tornament.findById(req.params.tornament_id, function(err, tornament) {

				if (err)
					res.send(err);
					
				for(var key in fields) {
			
					var field = fields[key];
					
					if (field.charAt(0) == ':')
						field = field.substr(1);
					
					if (typeof req.body[field] != "undefined")
						tornament[field] = req.body[field]
				
				}

				// save the bear
				tornament.save(function(err) {
					if (err) {
						res.send(err);
						console.log('error');
					} else {
						res.json({ message: 'Tornament updated!' });
					}
				});

			});
		})
		
		// delete the bear with this id (accessed at DELETE http://localhost:8080/api/bears/:bear_id)
		.delete(function(req, res) {
			Tornament.remove({
				_id: req.params.tornament_id
			}, function(err, tornament) {
				if (err)
					res.send(err);

				res.header('Access-Control-Allow-Origin', req.headers.origin);
				res.json({ message: 'Successfully deleted' });
			});
		});
		
		
	router.route('/tornaments')

		// create a bear (accessed at POST http://localhost:8080/api/bears)
		.post(function(req, res) {
			
			var tornament = new Tornament(); 		// create a new instance of the Bear model
					
			for(var key in fields) {
			
				var field = fields[key];
				
				if (field.charAt(0) == ':') {
					
					field = field.substr(1);
					
					if (typeof req.body[field] == "undefined"){
						res.send(400, {message: "Undefined required field '" + field + "'"});
					}
					
				}
				
				if (typeof req.body[field] != "undefined")
					tornament[field] = req.body[field]
				
			}

			// save the bear and check for errors
			tornament.save(function(err) {
				if (err)
					res.send(err);

				res.header('Access-Control-Allow-Origin', req.headers.origin);
				res.json({ 
					message: 'Tornament created!',
					tornamentId: tornament._id
				});
			});
			
		})
		
		.get(function(req, res) {
			Tornament.find(function(err, tornaments) {
				if (err)
					res.send(err);

				res.json(tornaments);
			});
		});

}
