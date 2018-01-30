'use strict';

eatsApp.controller('RadiusController', function ($scope, $window, $routeParams, UserFactory) {
  // UserFactory.getUser()
  // .then( (user) => {
  //   console.log("user in rad controller", user);
  //   $scope.currentUser = user;
  // });

  $scope.currentUser = UserFactory.getUser();
  //function to get user radius
  //display it as "your current radius is set to..."
  UserFactory.getUserRadius()
  .then( (returnedradius) => {
    console.log("returned radius obj values", Object.values(returnedradius)[0]);
      $scope.milesRadius = Object.values(returnedradius)[0].userRadius;
  });
  //give input box to change radius
  //store the value to firebase
  
  $scope.changeRadius = (newRad) => {
    //build userObj (with uid and desired radius)
    console.log("current user in setNewRad", $scope.currentUser);
    console.log("newRad in setNewRad", newRad);
    //pass to factory for posting/updating
    UserFactory.saveUserRadius(newRad);
  };

  $scope.changeRadiusToMeters = miles => {
    $scope.radius = miles * 1609;
  };
  //funtion to take input and re-set radius and run the suggestion again
});
	