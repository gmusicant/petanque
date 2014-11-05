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


	tornamentControllers.controller('TornamentDetailCtrl', function ($scope, $routeParams, $http, $location, $filter) {

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

		}

		updateActiveNav();

	});
