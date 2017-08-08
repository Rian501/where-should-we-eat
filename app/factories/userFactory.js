'use strict';

eatsApp.factory('UserFactory', function($q, $http, $window, FirebaseUrl, FBCreds) {

	var config = {
		apiKey: FBCreds.apiKey,
		authDomain: FBCreds.authDomain
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

	let userLoc = {};

	let locateUser = () => {
		return $q( (resolve, reject) => {
			console.log("locating user");
			if (navigator.geolocation) {
		      navigator.geolocation.getCurrentPosition(function(position) {
				    userLoc.lat = position.coords.latitude;
				    userLoc.lng = position.coords.longitude;
		      	 resolve(userLoc);
				});
			} else {
				console.log("Your browser does not seem to support geolocation!");
			}
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


	

return { loginUser, isAuthenticated, getUser, logoutUser, locateUser };

});
