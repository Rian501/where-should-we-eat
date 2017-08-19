'use strict';

eatsApp.controller('SuggestionsFavesController', function ($scope, $window, $routeParams, UserFactory, SuggestionsFactory, GoogleCreds) {


	SuggestionsFactory.getSavedlist(UserFactory.getUser())
	.then( (savedlist) => {
		$scope.savedListArray = savedlist;
	});

	
	$scope.removeFromSaved = (FBid) => {
		console.log("item to remove", FBid);
		SuggestionsFactory.removeFromSavelist(FBid)
		.then( (response) => {
			$window.location.reload();
		});
	};

	$scope.goToThere = (place_id) => {
		$window.location.href = `#!/done/${place_id}`;  
	};

});