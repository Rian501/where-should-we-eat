"use strict";

eatsApp.factory("UserFactory", function(
  $q,
  $http,
  $window,
  FirebaseUrl,
  FBCreds
) {
  var config = {
    apiKey: FBCreds.apiKey,
    authDomain: FBCreds.authDomain
  };

  firebase.initializeApp(config);
  var provider = new firebase.auth.GoogleAuthProvider();

  let currentUser = null;

  let isAuthenticated = () => {
    return $q((resolve, reject) => {
      firebase.auth().onAuthStateChanged(user => {
        if (user) {
          currentUser = user.uid;
          resolve(true);
        } else {
          //on logout need to set it back to null.
          currentUser = null;
          resolve(false);
        }
      });
    });
  };

  let loginUser = () => {
    return $q((resolve, reject) => {
      firebase
        .auth()
        .signInWithPopup(provider)
        .then(data => {
          currentUser = data.user.uid;
          console.log("currentUser", currentUser);
          resolve(data);
        })
        .catch(err => {
          console.log("error loggin in", err.message);
        });
    });
  };

  let userLoc = {};

  let locateUser = () => {
    return $q((resolve, reject) => {
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

  let getDay = () => {
    //0 is Sunday in this model, but I want 0 to be Mon and 6 to be Sun
    let today = null;
    var d = new Date();
    var n = d.getDay();
    if (n !== 0) {
      today = n - 1;
    } else {
      today = 6;
    }
    return today;
  };

  let getUser = () => {
    return currentUser;
  };

  let logoutUser = () => {
    return firebase
      .auth()
      .signOut()
      .catch(err => {
        console.log("Error logging out", err.message);
      });
  };

  let getUserRadius = () => {
    return $q((resolve, reject) => {
      $http
        .get(`${FirebaseUrl}radius.json?orderBy="uid"&equalTo="${currentUser}"`)
        .then(data => {
          console.log("daaaata from get user radius", data);
          resolve(data.data);
        });
    });
  };

  let updateUserRad = (currentUserRadiusFBkey, userRadObj) => {
    return $q((resolve, reject) => {
      $http
        .put(
          `${FirebaseUrl}radius/${currentUserRadiusFBkey}.json`,
          angular.toJson(userRadObj)
        )
        .then(response => {
          console.log("radius PUTed to fb");
          resolve(response);
        })
        .catch(err => reject(err));
    });
  };

  let postNewUserRad = userRadObj => {
    return $q((resolve, reject) => {
      $http
        .post(`${FirebaseUrl}radius.json`, angular.toJson(userRadObj))
        .then(response => {
          console.log("radius POSTed to fb");
          resolve(response);
        })
        .catch(err => reject(err));
    });
  };

  let saveUserRadius = userRad => {
    console.log("userRadObj passed to userfactory", userRad);
    //save object to FB with uid and radius (in miles??) ---
    //also, how to differentiate between updating and adding for first time
    if (currentUser) {
      let userRadObj = {
        uid: currentUser,
        userRadius: userRad
      };
      getUserRadius().then(data => {
        console.log(
          "data that comes back when I am testing to see if the radius is a post or a put",
          data
        );
        console.log(
          "Object.keys(data) that comes back when I am testing to see if the radius is a post or a put",
          Object.keys(data)
        );
        let currentUserRadiusFBkey = Object.keys(data)[0];
        if (Object.keys(data)[0]) {
          updateUserRad(currentUserRadiusFBkey, userRadObj).then(response => {
            console.log(response);
          });
        } else {
          postNewUserRad(userRadObj)
            .then(data => {
              console.log("posted data", data);
            })
            .catch(err => {
              console.log("error", err);
            });
        }
      });
    } else {
      alert("You must be signed in!");
    }
  };

  return {
    saveUserRadius,
    getUserRadius,
    loginUser,
    isAuthenticated,
    getUser,
    logoutUser,
    locateUser,
    getDay
  };
});
