module.exports = function(app, router){
	
	var Tornament     = require('./../models/tornament');
	var User     = require('./../models/user');
	
	var fields 	 = [':tornamentId', ':userIds', ':score'];
	
	router.route('/tornamentResults/:tornamentId')
		.get(function(req, res) {
			
			Tornament.findById(req.params.tornamentId, function(err, tornament) {
					
				if (err) {
					res.send(err);
				} else {
					res.json(tornament.results);
				}
					
			});
			
		});
	
	
	router.route('/tornamentResult')

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
			
			Tornament.findById(req.body.tornamentId, function(err, tornament) {
				
				if (err)
					res.send(err);
				else {
					
					var users = 
					
    				User.find({_id: { $in : req.body.userIds }}, function(err, users) {
    					
    					if (err)
    						res.send(err);
    					else {
    					    
    					    if (users) {
    					        
            					tornament.results.push({
            					    users: users,
            					    score: req.body.score,
            					    prize: req.body.prize,
            					});
            					
            					tornament.save(function(err) {
            					
            						if (err)
            							res.send(err);
                                    else
            						    res.json({ message: 'Tornament result created!' });
            						    
            					});
            					
    					    }
        					
    					}
    						
    				});
				
				}
				
			});
			
			
			
		})
		.delete(function(req, res) {
			    
		    Tornament.findById(req.body.tornamentId, function(err, tornament) {
			
				if (err)
					res.send(err);
				else {
				    
				    if (tornament) {
				    	
				    	var exteractIds = function(a){return a._id;}
				        var wasAffected = false;
				        
    				    for(var i = 0; i < tornament.results.length; i++) {
    				    
    				        var theSame = false;
    				        
    				        var resultUserIds = tornament.results[i].users.map(exteractIds);
    				        if (resultUserIds.length == req.body.userIds.length && resultUserIds.length) {
    				            
    				            theSame = true;
    				            for(var j = 0; j < resultUserIds.length && theSame; j++) {
    				                if (req.body.userIds.indexOf(resultUserIds[j]+'') == -1) {
    				                    theSame = false;
    				                }
    				            }
    				                
				                if (theSame) {
				                	
			                    	tornament.results.splice(i, 1);
			                    	wasAffected = true;

				                }
    				            
    				        }

    				    }
    				    
    				    if (wasAffected) {
	    				    
	    				    tornament.save(function(err) {
	            					
	    						if (err)
	    							res.send(err);
	                            else
	    						    res.json({ message: 'Tornament result created!' });
							    
							});
							
						} else 
    				    	res.send(400, {message: "Invalid userIds"});
				        
				    } else 
				        res.send(400, {message: "Invalid tornamentId"});
				}
		        
		    });
		    
		});

}
