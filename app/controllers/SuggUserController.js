'use strict';

eatsApp.controller('SuggestionsUserController', function ($scope, $window, $routeParams, UserFactory, SuggestionsFactory, GoogleCreds) {

    let suggestionsArray = [];

    $scope.ifUser = () => {
    	if(UserFactory.getUser()) {
    		return true;
    	} else {
    		return false;
    	}
    };

    $scope.defReady = () => {
    	if (suggestionsArray.length === 0) {
    		return false;
    	} else {
    		return true;
    	}
    };

	$scope.getInclude = () => {
	    if(UserFactory.getUser()){
	        return "templates/userNav.html";
	    } else {
		    return "templates/noUserNav.html";
	    }
	};

	$scope.initSuggestionsArray = () => {
		buildBlacklist();
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
		if (suggestionsArray.length < 10)  {
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
		if (suggestionsArray.length === 1) {
			$window.alert("Picky picky! You have rejected all results. Please try again.");
			$window.location.href = "!#/";
		} else {
		checkSuggestions();
		console.log("suggestions array", suggestionsArray);
		let rando = generateRandom(suggestionsArray);
		$scope.currentSuggestion = suggestionsArray.slice(rando, rando+1)[0];
		suggestionsArray.splice(rando, 1);
		console.log("current suggestion", $scope.currentSuggestion);
		if ($scope.currentSuggestion.photos !== undefined) {
			let photoref = $scope.currentSuggestion.photos[0].photo_reference;
			$scope.currentSuggestion.photoUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=500&photoreference=${photoref}&key=${GoogleCreds.PlacesApiKey}`;
		} else {
			$scope.currentSuggestion.photoUrl = `../../lib/images/restaurant-1724294_640.png`;
		}
	  }
	};

	$scope.moreInfo = () => {
		SuggestionsFactory.getPlaceDetails($scope.currentSuggestion.place_id)
		.then( (details) => {
			console.log("details?", details);
			$scope.details = details;
			$scope.today = UserFactory.getDay();
			console.log("today? Monday is 0, count from there", $scope.today);
		});
	};
		

	
	let rejectsArray = [];

	function buildBlacklist()  {
		let currentUser = UserFactory.getUser();
		console.log("currentUser", currentUser);
		SuggestionsFactory.getBlacklist(currentUser)
		.then( (listData) => {
			console.log("blacklist", listData);
			rejectsArray = rejectsArray.concat(listData);
		});
	}
	
	$scope.rejectSuggestion = () => {
		let newReject = $scope.currentSuggestion.id;
		rejectsArray.push(newReject);
		console.log("rejects ", rejectsArray);
	};

	$scope.blacklistSuggestion = (place_id, vicinity, locName) => {
		let currentUser = UserFactory.getUser();
			let neverObj = {
				name: locName,
				address: vicinity,
				place_id: place_id,
				uid: currentUser
			};
			SuggestionsFactory.addToBlacklist(neverObj)
			.then( (response) => {
				$scope.showNewSuggestion();
			});
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

	$scope.finishSession = ()  => {
		$window.location.href = '#!/done';
	};

	$scope.saveForLater = (place_id, vicinity, locName) => {
		let currentUser = UserFactory.getUser();
			let laterObj = {
				name: locName,
				address: vicinity,
				place_id: place_id,
				uid: currentUser
			};
				SuggestionsFactory.addToEatLater(laterObj)
				.then( (response) => {
					$scope.showNewSuggestion();
				});
		};	
	
});