module.exports = function(app, router){
	
	router.route('/auth/callback')

		// get the bear with that id (accessed at GET http://localhost:8080/api/bears/:bear_id)
		.get(function(req, res) {
			console.log('e');
			res.json('Works e');
		})
		
		// update the bear with this id (accessed at PUT http://localhost:8080/api/bears/:bear_id)
		.post(function(req, res) {

            console.log('b');
            res.json('Works b');
			
		})
	
}
