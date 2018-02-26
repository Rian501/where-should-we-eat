'use strict';

eatsApp.controller('RadiusController', function ($scope, $window, $routeParams, RadiusFactory, UserFactory) {

  $scope.currentUser = UserFactory.getUser();
  //function to get user radius
  //display it as "your current radius is set to..."
  UserFactory.getUserRadius()
  .then( (returnedradius) => {
      $scope.milesRadius = Object.values(returnedradius)[0].userRadius;
  });
  
  $scope.changeRadius = (newRad) => {
    UserFactory.saveUserRadius(newRad);
  };

  $scope.changeRadiusToMeters = miles => {
    $scope.radius = miles * 1609;
  };
  // funtion to take input and re-set radius and run the suggestion again
  $scope.reSearchRadius = (tempRad) => {
    $scope.radius = tempRad * 1609
  };

  $scope.radius = RadiusFactory;

});
	