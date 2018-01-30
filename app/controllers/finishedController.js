'use strict';

eatsApp.controller('FinishedController', function ($scope, $window, $routeParams, UserFactory, SuggestionsFactory, GoogleCreds) {

	$scope.getInclude = () => {
	    if(UserFactory.getUser()){
	        return "templates/userNav.html";
	    } else {
		    return "templates/noUserNav.html";
	    }
	};
	
	$scope.directions = () => {

		SuggestionsFactory.getPlaceDetails($routeParams.place_id)
			.then( (details) => {
				$scope.details = details;
			});
	};


});