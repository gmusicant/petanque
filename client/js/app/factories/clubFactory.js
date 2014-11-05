	  angular.module('clubsFactory', [])
	    .factory('clubs', function ($http) {
		  
		  var cacheClubs;
		  		  
		  return {
			  list : function (callback) {
			
				if (cacheClubs) {
					callback(cacheClubs);
				} else {
					$http.get('http://api.angular.com:8080/api/clubs').success(function (data) {
						cacheClubs = data;
						callback(data);
					});
				}
				  
			  }
		  };
		  
	  });    
