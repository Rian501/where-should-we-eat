'use strict';

eatsApp.controller('SuggestionsUserController', function ($scope, $window, $routeParams, UserFactory, SuggestionsFactory, GoogleCreds) {


	$scope.showTwentySuggestions = () => {
		SuggestionsFactory.getSuggestions(UserFactory.userLoc.lat, UserFactory.userLoc.lng, 10000)
		.then( (results) => {
		  	console.log("results!", results);
	  });
		
	};


});