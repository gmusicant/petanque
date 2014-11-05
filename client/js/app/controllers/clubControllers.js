	var clubControllers = angular.module('clubControllers', []);	  

	clubControllers.controller('ClubListCtrl', function ($scope, $http, $location, clubs) {
		
		$scope.addNew = function() {
			$location.path('/club/new/edit');
			updateActiveNav();
		};

		clubs.list(function(data) {
			$scope.clubs = data;
		});
		
		updateActiveNav();
		
	});

	clubControllers.controller('ClubDetailCtrl', function ($scope, $routeParams, $http, $location, $filter, clubs) {

		var clubId = $routeParams.clubId;

		$scope.fileUploaded = function (msg) {

			msg_object = JSON.parse(msg);
			$scope.club.photo = msg_object.filename;

		};

		$scope.addToClub = function (data) {

			if (typeof data != "undefined") {

				var index = $scope.users.indexOf(data.originalObject);
				if (index != -1) {

					$scope.clubUsers.unshift(data.originalObject);
					$scope.users.splice(index, 1);

					$http({
						method: 'POST',
						url: 'http://api.angular.com:8080/api/clubUsers',
						data: $.param({
							userId: data.originalObject._id, 
							clubId: clubId
						}),
						headers: {'Content-Type': 'application/x-www-form-urlencoded'}
					});

				}
			
			}

		};

		$scope.removeFromClub = function (user) {

			if (typeof user != "undefined") {

				var index = $scope.clubUsers.indexOf(user);
				if (index != -1) {

					$scope.users.push(user);						
					$scope.clubUsers.splice(index, 1);

					$http.delete('http://api.angular.com:8080/api/clubUsers/'+clubId+'/user/'+user._id).success(function(data) {
						//TODO: delete club from list and flush factory
					});

				}
				
			}

		};

		$scope.users = [];
		if (clubId != 'new') {
			
			$http.get('http://api.angular.com:8080/api/clubUsers/'+clubId).success(function(data) {
				$scope.clubUsers = data;
			});
			
		}

		$scope.clubDelete = function() {
			
			if (clubId != 'new') {
				
				$http.delete('http://api.angular.com:8080/api/clubs/'+clubId).success(function(data) {
					$location.path('/club');
					updateActiveNav();
				});
			}
			
		};

		$scope.clubSave = function() {

			if (clubId != 'new') {

				console.log($scope.club);

				$http({
					method: 'PUT',
					url: 'http://api.angular.com:8080/api/clubs/'+clubId,
					data: $.param($scope.club),
					headers: {'Content-Type': 'application/x-www-form-urlencoded'}
				}).success(function() {
					$location.path('/club/'+clubId);
					updateActiveNav();
				});

			} else {

				$http({
					method: 'POST',
					url: 'http://api.angular.com:8080/api/clubs',
					data: $.param($scope.club),
					headers: {'Content-Type': 'application/x-www-form-urlencoded'}
				}).success(function(data) {
					$location.path('/club/'+data.clubId);
					updateActiveNav();
				});

			}

		};

		if (clubId != 'new') {

			$http.get('http://api.angular.com:8080/api/clubs/'+clubId).success(function(data) {
				$scope.club = data;
			});

			$http.get('http://api.angular.com:8080/api/users').success(function(data) {
				$scope.users = data;
				$scope.currentUsers = $filter('filter')($scope.users, {clubId:clubId})
				$scope.users = $filter('filter')($scope.users, {clubId:"!"+clubId})
			});

		}

		updateActiveNav();

	});
