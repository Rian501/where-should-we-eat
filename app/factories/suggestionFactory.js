'use strict';

eatsApp.factory("SuggestionsFactory", function($q, $http, GoogleCreds, FirebaseUrl) {

	var config = {
		apiKey: GoogleCreds.apiKey
	};
	
	let API = config.apiKey;
	let nextPageToken = null;

	let fetchAPISuggestions = (userLat, userLon, radiusM) => {
		console.log("userLat", userLat);
		console.log("userLon", userLon);
		console.log("radius", radiusM);
		return $q( (resolve, reject) => {
			//opennow parameter auto filters results for currently open stuff
			//type restaurant can be changed...
			//keyword can also be adjusted for filtering..?
			$http.get(`https://emlemproxy.herokuapp.com/api/places/nearbysearch/json?location=${userLat},${userLon}&radius=${radiusM}&opennow=true&type=restaurant&keyword=food&key=${API}`)
			.then( (placesData) => {
				//the nextpagetoken is part of the object for the first page of results
				console.log("places??", placesData.data);
				console.log("page token?", placesData.data.next_page_token);
				nextPageToken = placesData.data.next_page_token;
				resolve(placesData.data.results);
			});
		});
	};

//new function for when user clicks next thingy.
	let fetchMoreSuggestions = () => {
		return $q( (resolve, reject) => {
			console.log("page token?", nextPageToken);
			console.log("API long", GoogleCreds.apiKey);
			console.log("API short", API);
			$http.get(`https://emlemproxy.herokuapp.com/api/places/nearbysearch/json?pagetoken=${nextPageToken}&key=${API}`)
			.then( (placesDataII) => {
				console.log("places II??", placesDataII);
				nextPageToken = placesDataII.data.next_page_token;
				resolve(placesDataII);
			});
		});
	};

	// let getDirections = () => {
	// 	return $q( (resolve, reject) => {
	// 		$http.get(`https://emlemproxy.herokuapp.com/api/directions/json?origin=[[usercoordinates]]&destination=place_id:[[PLACEID]]&key=YOUR_API_KEY`)
	// 	});
	// };

	let getPlaceDetails = (place_id) => {
		return $q( (resolve, reject) => {
			$http.get(`https://emlemproxy.herokuapp.com/api/places/details/json?placeid=${place_id}&key=${API}`)
			.then( (detailsData) => {
				resolve(detailsData.data.result);
			});
		});
	};

	let addToBlacklist = (nopeObj) => {
		return $q( (resolve, reject) => {
			$http.post(`${FirebaseUrl}blacklist.json`,
				angular.toJson(nopeObj))
			.then( (response) => {
				resolve(response);
			})
			.catch( (err) => {
				reject(err);
			});
		});
	};

	let removeFromBlacklist = (FBkey) => {
		return $q( (resolve, reject) => {
			if (FBkey) {
				$http.delete(`${FirebaseUrl}blacklist/${FBkey}.json`)
				.then( (data) => {
					resolve(data);
				})
				.catch( (err) => {
						reject(err);
					});
			} else {
				console.log("There was a mistake trying to delete this place!");
			}
		});
	};


	let getBlacklist = (uid) => {
		//get the objects on FB that match the UID
		return $q( (resolve, reject) => {
			$http.get(`${FirebaseUrl}blacklist.json?orderBy="uid"&equalTo="${uid}"`)
			.then( (data) => {
				let blacklistArr = [];
				console.log("data from getBlacklist?", data);
				Object.keys(data.data).forEach( (key) => {
					data.data[key].FBid = key;
					blacklistArr.push(data.data[key]);
				});
				resolve(blacklistArr);
			})
			.catch( (err) => {
				reject(err);
			});
		});
	};

	return { fetchAPISuggestions, fetchMoreSuggestions, addToBlacklist, getBlacklist, removeFromBlacklist, getPlaceDetails };
});


