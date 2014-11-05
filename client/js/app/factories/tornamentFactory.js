	  angular.module('tornamentsFactory', [])
	    .factory('tornaments', function ($http) {
		  
		  var cacheTornaments;
		  		  
		  return {
			  list : function (callback) {
			
				if (cacheTornaments) {
					callback(cacheTornaments);
				} else {
					$http.get('http://api.angular.com:8080/api/tornaments').success(function (data) {
						cacheTornaments = data;
						callback(data);
					});
				}
				  
			  }
		  };
		  
	  });    
