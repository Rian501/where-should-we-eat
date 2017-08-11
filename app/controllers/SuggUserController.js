'use strict';

eatsApp.controller('SuggestionsUserController', function ($scope, $window, $routeParams, UserFactory, SuggestionsFactory, GoogleCreds) {

    let suggestionsArray = [];
    let userLoc = {};

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
			userLoc.lat = data.lat;
			userLoc.lng = data.lng;
			SuggestionsFactory.fetchAPISuggestions(userLoc.lat, userLoc.lng, 7500)
			.then( (results) => {
			  	suggestionsArray = results;
			  	checkSuggestions();
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
		if (suggestionsArray.length === 1) {
			$window.alert("Picky picky! You have rejected all results. Please try again.");
			$window.location.href = "!#/";
		} else {
		checkSuggestions();
		let rando = generateRandom(suggestionsArray);
		$scope.currentSuggestion = suggestionsArray.slice(rando, rando+1)[0];
		suggestionsArray.splice(rando, 1);
		console.log("suggestionsArray", suggestionsArray);
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
		});
		SuggestionsFactory.getDirections(userLoc.lat, userLoc.lng, $scope.currentSuggestion.place_id)
		.then( (distData) => {
			console.log("distData!!", distData);
			$scope.distance = distData.distance;
			$scope.duration = distData.duration;

		});
	};
		

	
	let rejectsArray = [];

	function buildBlacklist()  {
		let currentUser = UserFactory.getUser();
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
		$scope.details = false;
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