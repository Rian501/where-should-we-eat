'use strict';

eatsApp.controller('SuggestionsGuestController', function ($scope, $window, $routeParams, UserFactory, SuggestionsFactory, GoogleCreds) {

    let suggestionsArray = [];

	$scope.initSuggestionsArray = () => {
		UserFactory.locateUser()
		.then( (data) => {
			console.log("userLoc?", data);
			SuggestionsFactory.fetchAPISuggestions(data.lat, data.lng, 8050)
			.then( (results) => {
			  	console.log("results!", results);
			  	suggestionsArray = results;
			  	checkSuggestions();
			  		console.log("suggestions array", suggestionsArray);
			  		return suggestionsArray;
			  	})
			.then( (suggestions) => {
				$scope.showNewSuggestion();
			});
		});
	};

	$scope.moreSuggestions = () => {
		//add more suggestions to the possible suggestions array
		if (suggestionsArray.length < 30)  {
			SuggestionsFactory.fetchMoreSuggestions()
			.then( (data) => {
				//concat the next page of results
				suggestionsArray = suggestionsArray.concat(data.data.results);
				suggestionsArray = _.uniq(suggestionsArray, 'id');
				checkSuggestions();
			});
		}
	};

	function generateRandom(array) {
	//pick a number between 0 and array length 
		let max = Math.floor(array.length-1);
		return Math.floor(Math.random()*(max));
	}

	let today = UserFactory.getDay();

	$scope.showNewSuggestion = () => {
		if (suggestionsArray.length === 0) {
			$window.alert("Picky picky! You have rejected all results. Please try again.");
		} else {
		console.log("suggestions array", suggestionsArray);
		let rando = generateRandom(suggestionsArray);
		$scope.currentSuggestion = suggestionsArray.slice(rando, rando+1)[0];
		suggestionsArray.splice(rando, 1);
		console.log("current suggestion", $scope.currentSuggestion);
		//probably need a promiseALL to get the date and also the details to display -
		// just display based on string word day instead of number..?
		//some places close and reopen in one day
		SuggestionsFactory.getPlaceDetails($scope.currentSuggestion.place_id)
		.then( (details) => {
			console.log("details?", details);
			console.log("hours per day with monday being 0", details.opening_hours);
			console.log("today's code?", today);
		});
		if ($scope.currentSuggestion.photos !== undefined) {
			let photoref = $scope.currentSuggestion.photos[0].photo_reference;
			$scope.currentSuggestion.photoUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photoref}&key=${GoogleCreds.PlacesApiKey}`;
		} else {
			$scope.currentSuggestion.photoUrl = `../../lib/images/restaurant-1724294_640.png`;
		}
	  }
	};

	
	let rejectsArray = [];

	
	$scope.rejectSuggestion = () => {
		let newReject = $scope.currentSuggestion.id;
		rejectsArray.push(newReject);
		console.log("rejects ", rejectsArray);
	};


	function checkSuggestions() {
		rejectsArray.forEach(function(item) {
			for (let i = 0; i < suggestionsArray.length; i++) {
				if (item.place_id == suggestionsArray[i].id) {
					console.log("what was cut?", suggestionsArray[i]);
					suggestionsArray.splice(i, i+1);
				}
			}
		});
		console.log("current state of rejects array", rejectsArray);
	}

	
	
});

