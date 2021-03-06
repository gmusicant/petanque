	var tornamentControllers = angular.module('tornamentControllers', []);

	tornamentControllers.controller('TornamentListCtrl', function ($scope, $http, $location, tornaments) {
		
		$scope.addNew = function() {
			$location.path('/tornament/new/edit');
			updateActiveNav();
		};
		
		tornaments.list(function(data) {
			$scope.tornaments = data;
		});

		updateActiveNav();
		
	});
	
	tornamentControllers.controller('TornamentCalendarCtrl', function () {
		
		updateActiveNav();
		
	});

	tornamentControllers.controller('TornamentDetailCtrl', function ($scope, $routeParams, $http, $location, $filter, users) {
	    
	    var clearUsers = function () {
	        
	        if (typeof $scope.tornamentResults != "undefined" && typeof $scope.users != "undefined") {
    		    
    		    var userIdsArrays = $scope.tornamentResults.map(function(a) {
                    var userIds = a.users.map(function(b) {
                        return b._id
                    });
                    return userIds;
                });
      
                // make a flat array from array of arrays          
                userIdsTmp = [];
                var i = 0;
                for(i = 0; i < userIdsArrays.length; i++)
                    userIdsTmp = userIdsTmp.concat(userIdsArrays[i]);
      
                // unique array elmets
                var userIds = [];
                for (i=0; i<userIdsTmp.length; i++)
                    if (userIds.indexOf(userIdsTmp[i]) === -1)
                        userIds.push(userIdsTmp[i]);

    		    // filter out users who alread exists in reports
    		    var filteredUsers = [];
    		    for(i=0; i<$scope.users.length; i++) {
    		        
    		        var index = userIds.indexOf($scope.users[i]._id);
				    if (index == -1)
				        filteredUsers.push($scope.users[i]);
    		        
    		    }
    		    $scope.users = filteredUsers;
    		    
		    }
	        
	    };

		$scope.types = [
			{type: "unknown", id: 0},
			{type: "tet", id: 1},
			{type: "doplet", id: 2},
			{type: "triplet", id: 3},
			{type: "type", id: 4}
		];

		var tornamentId = $routeParams.tornamentId;

		$scope.fileUploaded = function (msg) {

			msg_object = JSON.parse(msg);
			$scope.tornament.photo = msg_object.filename;

		};
		
		$scope.uploadUsers = function () {

		    users.list(function(data) {
		        
		        $scope.users = data;
		        clearUsers();
		        
		    });
		    
		};
		
		$scope.preAddUserMethod = function (data) {
		  
		    if (typeof data != "undefined") {

				var index = $scope.users.indexOf(data.originalObject);
				if (index != -1) {

                    if (typeof $scope.tornamentResult.users == "undefined")
                        $scope.tornamentResult.users = [];
                        
					$scope.tornamentResult.users.push(data.originalObject);
					$scope.users.splice(index, 1);
                    
				}
			
			}
		    
		};
		
		$scope.clearResult = function () {
		    $scope.users = $scope.users.concat($scope.tornamentResult.users);
		    $scope.tornamentResult = {};
		};
		
		$scope.addResult = function () {
		    
		    var tornamentResult = $scope.tornamentResult;
		    $scope.tornamentResult = {};
		    
		    var userIds = tornamentResult.users.map(function(a) {return a._id;});
		    
		    $http({
				method: 'POST',
				url: 'http://api.angular.com:8080/api/tornamentResult',
				data: $.param({
					userIds: userIds, 
					tornamentId: tornamentId,
					score: tornamentResult.score,
					prize: tornamentResult.prize
				}),
				headers: {'Content-Type': 'application/x-www-form-urlencoded'}
			});
			
			tornamentResult.score = parseInt(tornamentResult.score);
			$scope.tornamentResults.push(tornamentResult);
					
		};
		
		$scope.removeResult = function (tornamentResult) {
		    
		    if (typeof $scope.users != "undefined")
		        $scope.users = $scope.users.concat(tornamentResult.users);
		        
		    var userIds = tornamentResult.users.map(function(a) {return a._id;});
		    
		    var index = $scope.tornamentResults.indexOf(tornamentResult);
			if (index != -1)
				$scope.tornamentResults.splice(index, 1);

		    $http({
				method: 'DELETE',
				url: 'http://api.angular.com:8080/api/tornamentResult',
				data: $.param({
					userIds: userIds, 
					tornamentId: tornamentId
				}),
				headers: {'Content-Type': 'application/x-www-form-urlencoded'}
			});
			
			clearUsers();
		    
		};

		$scope.tornamentDelete = function () {

			if (tornamentId != 'new') {

				$http.delete('http://api.angular.com:8080/api/tornament/'+tornamentId).success(function(data) {
					$location.path('/tornament');
					updateActiveNav();				
				});

			}

		};

		$scope.tornamentSave = function() {

			if (tornamentId != 'new') {

				$http({
					method: 'PUT',
					url: 'http://api.angular.com:8080/api/tornament/'+tornamentId,
					data: $.param($scope.tornament),
					headers: {'Content-Type': 'application/x-www-form-urlencoded'}
				}).success(function() {
					$location.path('/tornament/'+tornamentId);
					updateActiveNav();
				});

			} else {

				$http({
					method: 'POST',
					url: 'http://api.angular.com:8080/api/tornaments',
					data: $.param($scope.tornament),
					headers: {'Content-Type': 'application/x-www-form-urlencoded'}
				}).success(function(data) {
					$location.path('/tornament/'+data.tornamentId);
					updateActiveNav();
				});

			}

		};

		if (tornamentId != 'new') {

			$http.get('http://api.angular.com:8080/api/tornament/'+tornamentId).success(function(data) {
				$scope.tornament = data;
			});
			
			$http.get('http://api.angular.com:8080/api/tornamentResults/'+tornamentId).success(function(tornamentTmp) {
				$scope.tornamentResults = tornamentTmp;
			});	
			
			

		}
		
        $scope.tornamentResult = {};
        
		updateActiveNav();

	});
