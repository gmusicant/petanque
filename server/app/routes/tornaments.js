module.exports = function(app, router){
	
	var request = require('google-oauth-jwt').requestWithJWT();
	var Tornament     = require('./../models/tornament');
	var fields 	 = [':title', 'description', ':type', 'photo', 'startDate', 'registrationTillDate', 'inscriptionDate', 'price', 'currency', 'prize'];
	
	var updateGoogleDates = function (tornament) {
	    
	    var types = [
			{type: "unknown", id: 0},
			{type: "tet", id: 1},
			{type: "doplet", id: 2},
			{type: "triplet", id: 3},
			{type: "type", id: 4}
		];
	    
	    var startDay = tornament.startDate.getDate();
        var startMonth = tornament.startDate.getMonth()+1;
        var startYear = tornament.startDate.getFullYear();
        var startHour = tornament.startDate.getHours();
        var startMinute = tornament.startDate.getMinutes();

        var startTime = startYear+'-'+startMonth+'-'+startDay+'T'+startHour+':'+startMinute+':00.000';
        var endTime = startYear+'-'+startMonth+'-'+startDay+'T18:00:00.000';
        
        typesPositions = types.map(function (a) {return a.id;});
        var index = typesPositions.indexOf(tornament.type);
        if (index == -1)
            index = 0;
        
        var currentType = types[index].type;
        
        var description = tornament.title+". Location: "+tornament.location.country+' '+tornament.location.city+". Type:"+currentType+'.'+tornament.description;
        
        var method, url;
        if (!tornament.googleEventId) {
            method = 'POST',
            url = 'https://www.googleapis.com/calendar/v3/calendars/nkj07pfar0af56sv5jji9tscl4@group.calendar.google.com/events';
        } else {
            method = 'PUT',
            url = 'https://www.googleapis.com/calendar/v3/calendars/nkj07pfar0af56sv5jji9tscl4@group.calendar.google.com/events/'+tornament.googleEventId;
        }

        request({
            method: method,
            url: url,
            body: {
                "summary": tornament.title,
                "description": description,
                "end": {
                    "dateTime": endTime,
                    "timeZone": "Europe/Kiev"
                },
                "start": {
                    "dateTime": startTime,
                    "timeZone": "Europe/Kiev"
                }
            },
            json: true,
            jwt: {
                // use the email address of the service account, as seen in the API console
                email: '462383371085-q47tcb73e1pc9jm6mhtettphnpvpu82s@developer.gserviceaccount.com',
                // use the PEM file we generated from the downloaded key
                keyFile: 'my-key-file.pem',
                // specify the scopes you wish to access - each application has different scopes
                scopes: ['https://www.googleapis.com/auth/calendar']
            }
        }, function (err, res, body) {
            
                tornament.googleEventId = body.id;
                tornament.save();
                
        });

    
	};

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
					    
					    updateGoogleDates(tornament);
					    
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
				else {
    
                    updateGoogleDates(tornament);
                    
    				//res.header('Access-Control-Allow-Origin', req.headers.origin);
    				res.json({ 
    					message: 'Tornament created!',
    					tornamentId: tornament._id
    				});
    				
				}
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
