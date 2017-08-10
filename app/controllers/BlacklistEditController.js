'use strict';

eatsApp.controller('BlacklistEditController', function ($scope, $window, $routeParams, UserFactory, SuggestionsFactory, GoogleCreds) {

	SuggestionsFactory.getBlacklist(UserFactory.getUser())
	.then( (blacklist) => {
		$scope.blacklistArray = blacklist;
	});

	SuggestionsFactory.getSavedlist(UserFactory.getUser())
	.then( (savedlist) => {
		$scope.savedListArray = savedlist;
	});

	$scope.removeFromBlacklist = (FBid) => {
		console.log("item to remove", FBid);
		SuggestionsFactory.removeFromBlacklist(FBid)
		.then( (response) => {
			$window.location.reload();
		});
	};

	$scope.removeFromSaved = (FBid) => {
		console.log("item to remove", FBid);
		SuggestionsFactory.removeFromSavelist(FBid)
		.then( (response) => {
			$window.location.reload();
		});
	};


});
