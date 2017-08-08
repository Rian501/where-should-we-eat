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

	$scope.moreSuggestions = () => {
		//add more suggestions to the possible suggestions array
		if (suggestionsArray.length < 30)  {
			SuggestionsFactory.fetchMoreSuggestions()
			.then( (data) => {
				console.log("more data", data.data.results);
				//concat the second (third?) page of results
				suggestionsArray = suggestionsArray.concat(data.data.results);
				//TODO need to ensure no duplicates
			});
		}
	};

	function generateRandom(array) {
	//pick a number between 0 and array length 
		let max = Math.floor(array.length-1);
		return Math.floor(Math.random()*(max));
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
	//add to rejects array? And/or remove from suggestions array -- currently "showNewSuggestion" is doing this

	};

	$scope.blacklistSuggestion = (place_id) => {
		let neverObj = {
			id: place_id,
			uid: UserFactory.uid
		};
		SuggestionsFactory.addToBlacklist(neverObj);
	//save to a blacklist firebase collection and remove from dom
// get id, make array of IDs, make sure nothing with a matching ID gets shown with an if statement?
//loop through ids and compare to suggestionsarray and remove from suggestions array anything that does match? Or, on point of display, check?
	};

	
  $scope.logout = () => {
      UserFactory.logoutUser()
      .then( (data) => {
          $window.location.href = "#!/";
          alert('successfully logged out');
      });
  };
	
	
});