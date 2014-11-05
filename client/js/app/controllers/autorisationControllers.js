	var autorisationControllers = angular.module('autorisationControllers', []);

	autorisationControllers.controller('AutorisationLoginCtrl', function ($scope, $http, $location, $rootScope) {
		
		$scope.loginUser = function () {
			
			$http({
				method: 'POST',
				url: 'http://api.angular.com:8080/api/autorisation/login',
				data: $.param({
					username:$scope.currentUser.username, 
					password:md5($scope.currentUser.password)
				}),
				headers: {'Content-Type': 'application/x-www-form-urlencoded'}
			}).success(function(data) {

				if (errorHendler(data)) {

					updateActiveNav();

				}

			}).error(function(data) {
				
				$http.get('http://api.angular.com:8080/api/users/542a9441380d43fb26000001').success(function (data) {

					$rootScope.currentUser = data;
					$rootScope.currentUser.session = md5('');
					$location.path($rootScope.preLoginUrl);
					updateActiveNav();
					
				});
				
			});
			
		};

		updateActiveNav();
		
	});
