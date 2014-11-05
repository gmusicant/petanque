module.exports = function(app, router){
	
	var fs = require('fs'); 
	
	router.route('/upload')		
		.post(function(req, res) {			
			
			res.json({success:true, filename: req.files.file.name});
			
		});
		
};
