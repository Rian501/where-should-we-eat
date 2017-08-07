'use strict';

eatsApp.factory("SuggestionsFactory", function($q, $http, GoogleCreds) {
	
	let API = GoogleCreds.apiKey;

	let getSuggestions = (userLat, userLon, radiusM) => {
		console.log("userLat", userLat);
		console.log("userLon", userLon);
		console.log("radius", radiusM);
		return $q( (resolve, reject) => {
			//opennow parameter auto filters results for currently open stuff
			//type restaurant can be changed...
			//keyword can also be adjusted for filtering..?
			$http.get(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${userLat},${userLon}&radius=${radiusM}&opennow=true&type=restaurant&keyword=food&key=${API}`)
			.then( (placesData) => {
				//the nextpagetoken is part of the object for the first page of results
				console.log("places??", placesData.data);
				console.log("page token?", placesData.data.next_page_token);
				let npt = placesData.data.next_page_token;
				return $q( (resolve, reject) => {
					console.log("page token?", npt);
					console.log("API long", GoogleCreds.apiKey);
					console.log("API short", API);
					$http.get(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?pagetoken=${npt}&key=${API}`)
					.then( (placesDataII) => {
						console.log("places II??", placesDataII);
					});
				});
			});
		});
	};


	//need to use token?? to get more results (next page, for example)
	//build an array in factory? filter by Open Now here? This is fundamental, so perhaps..
	//or in controller. Perhaps here build an array of open now, then filter by user stuff
	//in controller.
//it is not permitted to preload all 60, so a user action will need to trigger the first pagetoken reload.... separate function probably, with the first setting the value of the npt, and then the function being called on the first user reject click? this is more in line with the intendeduse of the api.
  

	return { getSuggestions };
});


