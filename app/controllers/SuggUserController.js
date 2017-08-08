'use strict';

eatsApp.controller('SuggestionsUserController', function ($scope, $window, $routeParams, UserFactory, SuggestionsFactory, GoogleCreds) {

    let suggestionsArray = [];

	$scope.initSuggestionsArray = () => {
		console.log("suggestions array initiated");
		UserFactory.locateUser()
		.then( (data) => {
			console.log("userLoc?", data);
			SuggestionsFactory.fetchAPISuggestions(data.lat, data.lng, 8050)
			.then( (results) => {
			  	console.log("results!", results);
			  	suggestionsArray = results;
			  		console.log("suggestions array", suggestionsArray);
			  		return suggestionsArray;
			  	});
		});
	};


	function generateRandom(array) {
	//pick a number between 0 and array length - this function may be causing problems by choosing numbers that don't work..?
		let max = Math.floor(array.length);
		return Math.floor(Math.random()*(max+1));
	}


	$scope.showNewSuggestion = () => {
		console.log("suggestions array", suggestionsArray);
		let rando = generateRandom(suggestionsArray);
		$scope.currentSuggestion = suggestionsArray.slice(rando, rando+1)[0];
		suggestionsArray.splice(rando, 1);
		console.log("suggestions array after splice?", suggestionsArray);
		console.log("current suggestion", $scope.currentSuggestion);

		let photomaxwidth = $scope.currentSuggestion.photos[0].width;
		let photoref = $scope.currentSuggestion.photos[0].photo_reference;
		$scope.currentSuggestion.photoUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=200&photoreference=${photoref}&key=${GoogleCreds.apiKey}`;
	  };

	$scope.rejectSuggestion = () => {
	//add to rejects array? And/or remove from suggestions array

	};

	$scope.blacklistSuggestion = () => {
	//save to a blacklist firebase collection and remove from dom

	};

	  //function to reject - add place_id to a rejects array?
	
});