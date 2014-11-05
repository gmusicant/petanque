	  angular.module('usersFactory', [])
	    .factory('users', function ($http) {
		  
		  var cacheUsers;
		  		  
		  return {
			  
			  list : function (callback) {
			
				if (cacheUsers) {
					callback(cacheUsers);
				} else {
					$http.get('http://api.angular.com:8080/api/users').success(function (data) {
						cacheUsers = data;
						callback(data);
					});
				}
				  
			  }
			  
		  };
		  
	  });    
