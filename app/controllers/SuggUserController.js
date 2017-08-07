'use strict';

eatsApp.controller('SuggestionsUserController', function ($scope, $window, $routeParams, UserFactory, SuggestionsFactory, GoogleCreds) {
	
	$scope.userLoc = {
      lat: 0,
      lng: 0
    };

    let suggestionsArray = [];

	$scope.getUserLocation = () => {
		if (navigator.geolocation) {
	      navigator.geolocation.getCurrentPosition(function(position) {
		    $scope.userLoc = {
		      lat: position.coords.latitude,
		      lng: position.coords.longitude
		    };
		    $scope.makeSuggestionsArray();
		  });
		} else {
			console.log("There was a problem with geolocation");
		}

	};

	$scope.makeSuggestionsArray = () => {
		SuggestionsFactory.fetchAPISuggestions($scope.userLoc.lat, $scope.userLoc.lng, 8050)
		.then( (results) => {
		  	console.log("results!", results);
		  	suggestionsArray = results;
		  		console.log("suggestions array", suggestionsArray);
		  		return suggestionsArray;
		  	});
		};

	$scope.showASuggestion = () => {
		console.log("suggestions array", suggestionsArray);
		$scope.currentSuggestion = suggestionsArray.slice(0,1)[0];
		console.log("current suggestion", $scope.currentSuggestion);
		//let photomaxwidth = $scope.currentSuggestion.photos[0].width;
		//let photoref = $scope.currentSuggestion.photos[0].photo_reference;
		//SuggestionsFactory.getOnePhoto(photomaxwidth, photoref);
	  };
});