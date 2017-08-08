'use strict';

eatsApp.controller('SuggestionsUserController', function ($scope, $window, $routeParams, UserFactory, SuggestionsFactory, GoogleCreds) {

	SuggestionsFactory.getBlacklist(UserFactory.getUser())
	.then( (blacklist) => {
		$scope.blacklistArray = blacklist;
		console.log("blacklist?", blacklist);
	});




});
