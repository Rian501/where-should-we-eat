'use strict';

eatsApp.controller('BlacklistEditController', function ($scope, $window, $routeParams, UserFactory, SuggestionsFactory, GoogleCreds) {

	SuggestionsFactory.getBlacklist(UserFactory.getUser())
	.then( (blacklist) => {
		$scope.blacklistArray = blacklist;
	});


	$scope.removeFromBlacklist = (FBid) => {
		console.log("item to remove", FBid);
		SuggestionsFactory.removeFromBlacklist(FBid)
		.then( (response) => {
			$window.location.reload();
		});
	};



});
