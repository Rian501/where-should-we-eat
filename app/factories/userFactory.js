'use strict';

eatsApp.factory('UserFactory', function($q, $http, FirebaseUrl, FBCreds) {

	var config = {
		apiKey: FBCreds.apiKey,
		authDomain: FBCreds.authDomain
	};

	let userLoc = {
      lat: 0,
      lng: 0
    };

	firebase.initializeApp(config);
	var provider = new firebase.auth.GoogleAuthProvider();

	let currentUser = null;

	let isAuthenticated = () => {
		return $q( (resolve, reject) => {
			firebase.auth().onAuthStateChanged( (user) => {
				if(user) {
					currentUser = user.uid;
					resolve(true);
				}
				else { //on logout need to set it back to null.
					currentUser = null;
					resolve(false);
				}
			});
		});
	};

	let loginUser = () => {
		return $q( (resolve, reject) => {
			firebase.auth().signInWithPopup( provider)
			.then( (data) => {
			currentUser = data.user.uid;
			console.log("currentUser", currentUser);
			resolve(data);
		  })
		  .catch( (err) => {
			console.log("error loggin in", err.message);
		  });
		});
	  };

	let getUser = () => {
		console.log("currentUser", currentUser);
		return currentUser;
	};

	let logoutUser = () => {
		return firebase.auth().signOut()
		.catch( (err) => {
			console.log("Error logging out", err.message);
		});
	};


	let locateUser = () => {
		console.log("get user location button clicked");
		if (navigator.geolocation) {
		  console.log("navigator?", navigator.geolocation);
	      navigator.geolocation.getCurrentPosition(function(position) {
		    userLoc = {
		      lat: position.coords.latitude,
		      lng: position.coords.longitude
		    };
		    console.log("userLocation?", userLoc);
		    //return userLoc;
		  });

		} else {
			console.log("There was a problem with geolocation");
		}
	};

return {locateUser, loginUser, isAuthenticated, getUser, logoutUser};
});
