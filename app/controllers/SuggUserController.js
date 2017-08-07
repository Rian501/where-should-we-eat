'use strict';

eatsApp.controller('SuggestionsUserController', function ($scope, $window, $routeParams, SuggestionsFactory, GoogleCreds) {

	var config = {
		apiKey: GoogleCreds.apiKey
	};

//to get the user's location
	let userLoc = {
      lat: 0,
      lng: 0
    };

	$scope.getUserLocation = () => {
		console.log("clicked anyway");
		if (navigator.geolocation) {
	      navigator.geolocation.getCurrentPosition(function(position) {
		    userLoc = {
		      lat: position.coords.latitude,
		      lng: position.coords.longitude
		    };
		    console.log("userLocation?", userLoc);
			SuggestionsFactory.getSuggestions(userLoc.lat, userLoc.lng, 12000);
		    return userLoc;
		  }); 
		}
	};


});