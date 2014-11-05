	var petanqueApp = angular.module('petanqueApp', [

		/* third party modules */

		'ngRoute',  // for routes
		'angucomplete-alt',  // for autocomplete
		'ui.bootstrap',  // for date-picker
		'flow', // for images upload

		/* custom modules */

		// controllers
		'autorisationControllers',
		'userControllers', 
		'clubControllers', 
		'tornamentControllers',

		// factories
		'usersFactory',
		'clubsFactory',
		'tornamentsFactory',
		
		//directives
		

	]);
	
	/* configs */
       
	petanqueApp.config(['$httpProvider', function ($httpProvider) {
		$httpProvider.defaults.headers.common = {};
		$httpProvider.defaults.headers.post = {};
		$httpProvider.defaults.headers.put = {};
		$httpProvider.defaults.headers.patch = {};
	}]);
  	  
	/* routes */

	petanqueApp.config(function($routeProvider) {
		$routeProvider.
		when('/', {
			templateUrl: 'templates/users/user-list.html',
			controller: 'UserListCtrl'
		}).
		when('/user', {
			templateUrl: 'templates/users/user-list.html',
			controller: 'UserListCtrl'
		}).
		when('/user/:userId', {
			templateUrl: 'templates/users/user-detail.html',
			controller: 'UserDetailCtrl'
		}).
		when('/user/:userId/edit', {
			templateUrl: 'templates/users/user-detail-edit.html',
			controller: 'UserDetailCtrl'
		}).
		when('/club', {
			templateUrl: 'templates/clubs/club-list.html',
			controller: 'ClubListCtrl'
		}).
		when('/club/:clubId', {
			templateUrl: 'templates/clubs/club-detail.html',
			controller: 'ClubDetailCtrl'
		}).
		when('/club/:clubId/edit', {
			templateUrl: 'templates/clubs/club-detail-edit.html',
			controller: 'ClubDetailCtrl'
		}).
		when('/tornament', {
			templateUrl: 'templates/tornaments/tornament-list.html',
			controller: 'TornamentListCtrl'
		}).
		when('/tornament/:tornamentId', {
			templateUrl: 'templates/tornaments/tornament-detail.html',
			controller: 'TornamentDetailCtrl'
		}).
		when('/tornament/:tornamentId/edit', {
			templateUrl: 'templates/tornaments/tornament-detail-edit.html',
			controller: 'TornamentDetailCtrl'
		}).
		when('/autorisation/login', {
			templateUrl: 'templates/autorisation/login.html',
			controller: 'AutorisationLoginCtrl'
		}).
		when('/autorisation/register', {
			templateUrl: 'templates/autorisation/register.html',
			controller: 'AutorisationRegisterCtrl'
		}).
		otherwise({
			redirectTo: '/'
		});		
	});
	
	petanqueApp.run(function ($rootScope, $location) {
		
		$rootScope.currentUser = {};
		$rootScope.preLoginUrl = '/';
		
		$rootScope.logOut = function () {
			$rootScope.currentUser = {};
		};
		
		$rootScope.preLogin = function () {
			$rootScope.preLoginUrl = $location.path();
		};
		
	});
