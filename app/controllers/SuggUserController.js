'use strict';

eatsApp.controller('SuggestionsUserController', function ($scope, $window, $routeParams, UserFactory, SuggestionsFactory, GoogleCreds) {

	let userLoc = {
      lat: 0,
      lng: 0
    };

	$scope.getUserLocation = () => {
		//either need to promise-ofy this so that I can make the get suggestions a .then... or else need to call that from here... then the "make suggestion" will bring up the display of a random thing, rather than fetch stuff
		console.log("get user location button clicked");
		if (navigator.geolocation) {
		  console.log("navigator?", navigator.geolocation);
	      navigator.geolocation.getCurrentPosition(function(position) {
		    userLoc = {
		      lat: position.coords.latitude,
		      lng: position.coords.longitude
		    };
		    console.log("userLocation?", userLoc);
		    makeSuggestionsArray();
		  });

		console.log("userLoc?", userLoc);
		$window.location.href = "#!/user/suggest";
	    return userLoc;
		} else {
			console.log("There was a problem with geolocation");
		}

	};

	function makeSuggestionsArray() {
		console.log("userLoc?", userLoc);
		SuggestionsFactory.getSuggestions(userLoc.lat, userLoc.lng, 10000)
		.then( (results) => {
		  	console.log("results!", results);
		});
	}

	$scope.showASuggestion = () => {
	  };
		



});