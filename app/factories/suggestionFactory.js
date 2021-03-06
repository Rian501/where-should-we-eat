'use strict';

eatsApp.factory("SuggestionsFactory", function ($q, $http, GoogleCreds, FirebaseUrl) {

	var config = {
		placesAPI: GoogleCreds.PlacesApiKey,
		placesAPI2: GoogleCreds.PlacesApiKey2,
		directionsAPI: GoogleCreds.DirectionsApiKey
	};

	let placesAPI = config.placesAPI;
	let placesAPI2 = config.placesAPI2;
	let directionsAPI = config.directionsAPI;
	let nextPageToken = null;
	let type = 'restaurant';



	//instead of messing with re-querying, just get the first set from each of a set of queries.
	//make a promise-all collection by mapping over an array of types
	//allow user to eliminate food types  - when a user rejects a type, push all suggestions from that type into temporary rejects
	let getPlacesSuggestionsByKeyword = (keywrd) => {
		return $http.get(
			`https://emlemproxy.herokuapp.com/api/places/nearbysearch/json?location=${userLat},${userLon}&radius=${radiusM}&opennow=true&type=${type}&keyword=${keywrd}&key=${placesAPI2}`
		)
	};

	let fetchAPISuggestions = (userLat, userLon, radiusM, keywordArr) => {
		let promisesArr = keywordArr.map((keywrd) => {
			return $http.get(
				`https://emlemproxy.herokuapp.com/api/places/nearbysearch/json?location=${userLat},${userLon}&radius=${radiusM}&opennow=true&type=${type}&keyword=${keywrd}&key=${placesAPI2}`
			)
		})
		console.log("proms", promisesArr);

		return $q.all(promisesArr)


		// 	return $q((resolve, reject) => {
		// 		//type restaurant can be changed...
		// 		//keyword can also be adjusted for filtering..?
		// 		$http
		// 			.get(
		// 				`https://emlemproxy.herokuapp.com/api/places/nearbysearch/json?location=${userLat},${userLon}&radius=${radiusM}&opennow=true&type=${type}&keyword=${keyword}&keyword=food&key=${placesAPI2}`
		// 			)
		// 			.then(placesData => {
		// 				//the nextpagetoken is part of the object for the first page of results
		// 				nextPageToken = placesData.data.next_page_token;
		// 				resolve(placesData.data.results);
		// 			});
		// 	});
	};

	//new function for when user clicks for next suggestion.
	let moreCounter = 0;
	let fetchMoreSuggestions = () => {
		return $q((resolve, reject) => {
			console.log("fetching more suggestions, moreCounter:", moreCounter);
			console.log("current nextpagetoken", nextPageToken);
			if (moreCounter < 6) {
				$http.get(`https://emlemproxy.herokuapp.com/api/places/nearbysearch/json?pagetoken=${nextPageToken}&key=${placesAPI2}`)
					.then((placesDataII) => {
						console.log("(trying to figure out what is going on with fetch more.. placesIIData", placesDataII.data);
						nextPageToken = placesDataII.data.next_page_token;
						moreCounter += 1;
						resolve(placesDataII.data);
					})
					.catch((error) => console.log(error));
			} else {
				return false;
			}
		});
	};

	let getDirections = (userLat, userLon, destID) => {
		return $q((resolve, reject) => {
			$http.get(`https://emlemproxy.herokuapp.com/api/distance/json?origin=${userLat},${userLon}&destination=place_id:${destID}&key=${directionsAPI}`)
				.then((data) => {
					resolve(data.data.routes[0].legs[0]);
				});
		});
	};

	let getPlaceDetails = (place_id) => {
		return $q((resolve, reject) => {
			$http.get(`https://emlemproxy.herokuapp.com/api/places/details/json?placeid=${place_id}&key=${placesAPI2}`)
				.then((detailsData) => {
					resolve(detailsData.data.result);
				});
		});
	};

	let addToBlacklist = (nopeObj) => {
		return $q((resolve, reject) => {
			$http.post(`${FirebaseUrl}blacklist.json`,
				angular.toJson(nopeObj))
				.then((response) => {
					resolve(response);
				})
				.catch((err) => {
					reject(err);
				});
		});
	};

	let addToEatLater = (laterObj) => {
		return $q((resolve, reject) => {
			$http.post(`${FirebaseUrl}trylater.json`,
				angular.toJson(laterObj))
				.then((response) => {
					resolve(response);
				})
				.catch((err) => {
					reject(err);
				});
		});
	};

	let removeFromBlacklist = (FBkey) => {
		return $q((resolve, reject) => {
			if (FBkey) {
				$http.delete(`${FirebaseUrl}blacklist/${FBkey}.json`)
					.then((data) => {
						resolve(data);
					})
					.catch((err) => {
						reject(err);
					});
			} else {
				console.log("There was a mistake trying to delete this place!");
			}
		});
	};

	let removeFromSavelist = (FBkey) => {
		return $q((resolve, reject) => {
			if (FBkey) {
				$http.delete(`${FirebaseUrl}trylater/${FBkey}.json`)
					.then((data) => {
						resolve(data);
					})
					.catch((err) => {
						reject(err);
					});
			} else {
				console.log("There was a mistake trying to delete this place!");
			}
		});
	};

	let getBlacklist = (uid) => {
		//get the objects on FB that match the UID
		return $q((resolve, reject) => {
			$http.get(`${FirebaseUrl}blacklist.json?orderBy="uid"&equalTo="${uid}"`)
				.then((data) => {
					let blacklistArr = [];
					Object.keys(data.data).forEach((key) => {
						data.data[key].FBid = key;
						blacklistArr.push(data.data[key]);
					});
					resolve(blacklistArr);
				})
				.catch((err) => {
					reject(err);
				});
		});
	};

	let getSavedlist = (uid) => {
		//get the objects on FB that match the UID
		return $q((resolve, reject) => {
			$http.get(`${FirebaseUrl}trylater.json?orderBy="uid"&equalTo="${uid}"`)
				.then((data) => {
					let tryLaterArr = [];
					Object.keys(data.data).forEach((key) => {
						data.data[key].FBid = key;
						tryLaterArr.push(data.data[key]);
					});
					resolve(tryLaterArr);
				})
				.catch((err) => {
					reject(err);
				});
		});
	};


	return { addToEatLater, removeFromSavelist, getSavedlist, fetchAPISuggestions, fetchMoreSuggestions, addToBlacklist, getBlacklist, removeFromBlacklist, getPlaceDetails, getDirections, getPlacesSuggestionsByKeyword };
});


