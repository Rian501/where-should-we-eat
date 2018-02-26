"use strict";

eatsApp.controller("RadiusController", function(
  $scope,
  $window,
  $location,
  $routeParams,
  RadiusFactory,
  UserFactory
) {

  $scope.currentUser = UserFactory.getUser();
  //function to get user radius
  //display it as "your current radius is set to..."
  UserFactory.getUserRadius().then(returnedradius => {
    $scope.milesRadius = Object.values(returnedradius)[0].userRadius;
  });

  $scope.changeRadius = newRad => {
    //save object to FB with uid and radius (in miles??) ---
    //also, how to differentiate between updating and adding for first time
    if ($scope.currentUser) {
      let userRadObj = { uid: $scope.currentUser, userRadius: newRad };
      UserFactory.getUserRadius().then(data => {
        let currentUserRadiusFBkey = Object.keys(data)[0];
        if (Object.keys(data)[0]) {
          UserFactory.updateUserRad(currentUserRadiusFBkey, userRadObj)
          .then(response => {
              console.log("putted data", response);
              $location.url("/");            });
        } else {
          UserFactory.postNewUserRad(userRadObj)
            .then(data => {
              console.log("posted data", data);
              $location.url("/");            })
            .catch(err => {
              console.log("error", err);
            });
        }
      });
    } else {
      alert("You must be signed in!");
    }
  };
  // UserFactory.saveUserRadius(newRad)
  // .then( (responsedata) => {
  //   console.log(responsedata);
  // });
  // };

  // $scope.changeRadiusToMeters = miles => {
  //   $scope.radius = miles * 1609;
  // };
  // funtion to take input and re-set radius and run the suggestion again
  $scope.reSearchRadius = tempRad => {
    $scope.radius = tempRad * 1609;
    $location.url(`/${$scope.radius}`);
    //instead of just setting back to the main URL, instead perhaps pass as routeparams and then set up a new path to the same patrial and controller, but do some kind of IF statement for the reception of a routeparam, and override the ifuser... maybe and else-if --tbc
  };

  $scope.radius = RadiusFactory;
});
