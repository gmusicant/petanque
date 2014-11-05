	var userControllers = angular.module('userControllers', []);

	userControllers.controller('UserListCtrl', function ($scope, $http, $location, users) {
		
		$scope.addNew = function() {
			$location.path('/user/new/edit');
			updateActiveNav();
		};

		users.list(function(data) {
			$scope.users = data;
		});

		updateActiveNav();
		
	});

	userControllers.controller('UserDetailCtrl', function ($scope, $routeParams, $http, $location) {

		var userId = $routeParams.userId;

		$scope.genders = [
			{gender: "uncnown", id: 0},
			{gender: "man", id: 1},
			{gender: "woman", id: 2}
		];

		$scope.user = {
			gender: 0
		}; 

		$scope.club = {
			title: "",
			city: ""
		};

		$scope.fileUploaded = function(msg) {
			msg_object = JSON.parse(msg);
			$scope.user.photo = msg_object.filename;
		};

		$scope.changeClub = function(data, user) {

			if (typeof data != "undefined") {

				$scope.user.clubId = data.originalObject._id;
				$scope.club = data.originalObject;

				$http({
					method: 'POST',
					url: 'http://api.angular.com:8080/api/clubUsers',
					data: $.param({clubId:data.originalObject._id, userId:userId}),
					headers: {'Content-Type': 'application/x-www-form-urlencoded'}
				});

			}

		};

		$scope.userDelete = function() {
			
			if (userId != 'new') {
				
				$http.delete('http://api.angular.com:8080/api/users/'+userId).success(function(data) {
					$location.path('#/');
					updateActiveNav();
				});
				
			}
			
		};

		$scope.userSave = function() {

			if (userId != 'new') {

				$http({
					method: 'PUT',
					url: 'http://api.angular.com:8080/api/users/'+userId,
					data: $.param($scope.user),
					headers: {'Content-Type': 'application/x-www-form-urlencoded'}
				}).success(function(data) {

					if (errorHendler(data)) {

						$location.path('/user/'+userId);
						updateActiveNav();

					}

				});

			} else {

				$http({
					method: 'POST',
					url: 'http://api.angular.com:8080/api/users',
					data: $.param($scope.user),
					headers: {'Content-Type': 'application/x-www-form-urlencoded'}
				}).success(function(data) {
					$location.path('/user/'+data.userId);
					updateActiveNav();
				});

			}

		};

		if (userId != 'new') {

			$http.get('http://api.angular.com:8080/api/users/'+userId).success(function(data) {

				$scope.user = data;

				if (typeof data.clubId != 'undefined') {

					var clubId = data.clubId;
					if (clubId) {
						
						$http.get('http://api.angular.com:8080/api/clubs/'+clubId).success(function(data) {
							$scope.club = data;
						});
						
					}

				}

			});

			$http.get('http://api.angular.com:8080/api/clubs').success(function(data) {
				$scope.clubs = data;
			});

		}

		updateActiveNav();

	});
